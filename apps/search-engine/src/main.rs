use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::{info, instrument};

mod config;
mod elasticsearch;
mod models;
mod search;
mod cache;

use config::Config;
use search::SearchService;

#[derive(Clone)]
pub struct AppState {
    search_service: Arc<SearchService>,
}

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    q: Option<String>,
    origin: Option<String>,
    destination: Option<String>,
    departure_date: Option<String>,
    return_date: Option<String>,
    passengers: Option<u32>,
    cabin: Option<String>,
    max_price: Option<f64>,
    max_stops: Option<u32>,
    airlines: Option<String>, // comma-separated
    sort: Option<String>,
    limit: Option<u32>,
    offset: Option<u32>,
}

#[derive(Debug, Serialize)]
pub struct SearchResponse {
    flights: Vec<models::Flight>,
    total: u64,
    took: u64, // milliseconds
    aggregations: Option<HashMap<String, serde_json::Value>>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::init();

    // Load configuration
    let config = Config::new()?;
    info!("Starting SkyScout Search Engine on port {}", config.port);

    // Initialize services
    let search_service = Arc::new(SearchService::new(&config).await?);

    let state = AppState { search_service };

    // Build routes
    let app = Router::new()
        .route("/", get(health_check))
        .route("/health", get(health_check))
        .route("/search", get(search_flights))
        .route("/index", post(index_flights))
        .route("/autocomplete", get(autocomplete))
        .route("/popular-routes", get(popular_routes))
        .with_state(state)
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    // Start server
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.port)).await?;
    info!("🚀 Search Engine listening on port {}", config.port);
    
    axum::serve(listener, app).await?;

    Ok(())
}

#[instrument]
async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "skyscout-search-engine",
        "version": env!("CARGO_PKG_VERSION")
    }))
}

#[instrument(skip(state))]
async fn search_flights(
    State(state): State<AppState>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<SearchResponse>, StatusCode> {
    let search_request = search::SearchRequest::from_query(params);
    
    match state.search_service.search_flights(search_request).await {
        Ok(response) => Ok(Json(SearchResponse {
            flights: response.flights,
            total: response.total,
            took: response.took,
            aggregations: response.aggregations,
        })),
        Err(err) => {
            tracing::error!("Search error: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

#[instrument(skip(state))]
async fn index_flights(
    State(state): State<AppState>,
    Json(flights): Json<Vec<models::Flight>>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    match state.search_service.index_flights(flights).await {
        Ok(count) => Ok(Json(serde_json::json!({
            "indexed": count,
            "status": "success"
        }))),
        Err(err) => {
            tracing::error!("Indexing error: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

#[instrument(skip(state))]
async fn autocomplete(
    State(state): State<AppState>,
    Query(params): Query<HashMap<String, String>>,
) -> Result<Json<Vec<String>>, StatusCode> {
    let query = params.get("q").unwrap_or(&String::new()).clone();
    
    match state.search_service.autocomplete(&query).await {
        Ok(suggestions) => Ok(Json(suggestions)),
        Err(err) => {
            tracing::error!("Autocomplete error: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

#[instrument(skip(state))]
async fn popular_routes(
    State(state): State<AppState>,
) -> Result<Json<Vec<models::PopularRoute>>, StatusCode> {
    match state.search_service.get_popular_routes().await {
        Ok(routes) => Ok(Json(routes)),
        Err(err) => {
            tracing::error!("Popular routes error: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
