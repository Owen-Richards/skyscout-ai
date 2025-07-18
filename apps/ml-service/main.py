from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import asyncio
import logging
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import redis
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SkyScout AI - ML Service",
    description="Machine Learning service for flight price prediction and demand forecasting",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis client for caching
redis_client = redis.Redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379"),
    decode_responses=True
)

# Models storage
models = {}
scalers = {}

# Request/Response models
class FlightPredictionRequest(BaseModel):
    origin: str = Field(..., min_length=3, max_length=3, description="Origin airport IATA code")
    destination: str = Field(..., min_length=3, max_length=3, description="Destination airport IATA code")
    departure_date: str = Field(..., description="Departure date (YYYY-MM-DD)")
    return_date: Optional[str] = Field(None, description="Return date (YYYY-MM-DD)")
    booking_date: str = Field(..., description="Booking date (YYYY-MM-DD)")
    passengers: int = Field(1, ge=1, le=9, description="Number of passengers")
    cabin: str = Field("economy", description="Cabin class")
    historical_prices: Optional[List[float]] = Field(None, description="Historical price data")

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence: float
    price_trend: str  # "increasing", "decreasing", "stable"
    recommendation: str  # "buy_now", "wait", "book_soon"
    best_booking_window: Dict[str, int]  # days before departure
    factors: Dict[str, float]  # feature importance

class DemandForecastRequest(BaseModel):
    origin: str
    destination: str
    start_date: str
    end_date: str
    granularity: str = "daily"  # daily, weekly, monthly

class DemandForecastResponse(BaseModel):
    route: str
    period: Dict[str, str]
    forecast: List[Dict[str, Any]]
    peak_periods: List[Dict[str, str]]
    seasonal_patterns: Dict[str, float]

class OptimalTimingRequest(BaseModel):
    origin: str
    destination: str
    flexible_dates: bool = True
    budget_range: Optional[Dict[str, float]] = None
    preferred_months: Optional[List[str]] = None

class OptimalTimingResponse(BaseModel):
    best_months: List[Dict[str, Any]]
    cheapest_days: List[str]
    optimal_booking_lead_time: int
    seasonal_analysis: Dict[str, float]

# Dependency to get ML models
async def get_price_model(route: str):
    """Load or train price prediction model for a specific route"""
    model_key = f"price_model_{route}"
    
    if model_key not in models:
        # Try to load from cache/storage
        try:
            cached_model = redis_client.get(f"ml_model:{model_key}")
            if cached_model:
                models[model_key] = joblib.loads(cached_model.encode())
            else:
                # Train new model with historical data
                models[model_key] = await train_price_model(route)
        except Exception as e:
            logger.error(f"Error loading model for {route}: {e}")
            # Use default model
            models[model_key] = create_default_price_model()
    
    return models[model_key]

async def train_price_model(route: str):
    """Train a price prediction model for a specific route"""
    logger.info(f"Training price model for route: {route}")
    
    # In production, this would load real historical data
    # For now, create a mock model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    
    # Generate mock training data
    X = np.random.rand(1000, 8)  # 8 features
    y = np.random.rand(1000) * 500 + 200  # Prices between $200-$700
    
    model.fit(X, y)
    
    # Cache the model
    try:
        model_bytes = joblib.dumps(model)
        redis_client.setex(f"ml_model:price_model_{route}", 3600, model_bytes)
    except Exception as e:
        logger.error(f"Error caching model: {e}")
    
    return model

def create_default_price_model():
    """Create a simple default model"""
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    # Train with minimal data
    X = np.random.rand(100, 8)
    y = np.random.rand(100) * 400 + 200
    model.fit(X, y)
    return model

def extract_features(request: FlightPredictionRequest) -> np.ndarray:
    """Extract features from the prediction request"""
    
    # Parse dates
    departure = datetime.strptime(request.departure_date, "%Y-%m-%d")
    booking = datetime.strptime(request.booking_date, "%Y-%m-%d")
    
    # Calculate features
    days_ahead = (departure - booking).days
    day_of_week = departure.weekday()
    month = departure.month
    is_weekend = 1 if day_of_week >= 5 else 0
    is_holiday_season = 1 if month in [6, 7, 8, 12] else 0
    
    # Cabin encoding
    cabin_encoding = {
        "economy": 0,
        "premium_economy": 1,
        "business": 2,
        "first": 3
    }
    cabin_encoded = cabin_encoding.get(request.cabin, 0)
    
    features = np.array([
        days_ahead,
        day_of_week,
        month,
        is_weekend,
        is_holiday_season,
        request.passengers,
        cabin_encoded,
        len(request.historical_prices) if request.historical_prices else 0
    ]).reshape(1, -1)
    
    return features

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": len(models),
        "redis_connected": redis_client.ping()
    }

@app.post("/predict/price", response_model=PredictionResponse)
async def predict_price(request: FlightPredictionRequest):
    """Predict flight price using machine learning"""
    try:
        route = f"{request.origin}-{request.destination}"
        model = await get_price_model(route)
        
        # Extract features
        features = extract_features(request)
        
        # Make prediction
        predicted_price = model.predict(features)[0]
        
        # Calculate confidence (mock implementation)
        confidence = min(0.95, max(0.6, np.random.random() * 0.4 + 0.6))
        
        # Determine trend and recommendation
        if request.historical_prices and len(request.historical_prices) > 1:
            recent_trend = np.mean(request.historical_prices[-3:]) - np.mean(request.historical_prices[-6:-3])
            if recent_trend > 10:
                trend = "increasing"
                recommendation = "book_soon"
            elif recent_trend < -10:
                trend = "decreasing"
                recommendation = "wait"
            else:
                trend = "stable"
                recommendation = "buy_now" if predicted_price < 400 else "wait"
        else:
            trend = "stable"
            recommendation = "buy_now"
        
        # Feature importance (mock)
        factors = {
            "booking_advance": 0.35,
            "seasonality": 0.25,
            "day_of_week": 0.15,
            "cabin_class": 0.15,
            "demand": 0.10
        }
        
        return PredictionResponse(
            predicted_price=round(predicted_price, 2),
            confidence=round(confidence, 3),
            price_trend=trend,
            recommendation=recommendation,
            best_booking_window={"min_days": 21, "max_days": 60},
            factors=factors
        )
        
    except Exception as e:
        logger.error(f"Error predicting price: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/forecast/demand", response_model=DemandForecastResponse)
async def forecast_demand(request: DemandForecastRequest):
    """Forecast travel demand for a route"""
    try:
        route = f"{request.origin}-{request.destination}"
        
        # Generate mock forecast data
        start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
        end_date = datetime.strptime(request.end_date, "%Y-%m-%d")
        
        # Create daily forecasts
        forecast = []
        current_date = start_date
        
        while current_date <= end_date:
            # Mock demand calculation
            base_demand = 100
            seasonal_factor = 1.2 if current_date.month in [6, 7, 8, 12] else 1.0
            weekend_factor = 1.3 if current_date.weekday() >= 5 else 1.0
            
            demand = int(base_demand * seasonal_factor * weekend_factor * (0.8 + np.random.random() * 0.4))
            
            forecast.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "demand": demand,
                "confidence": round(np.random.random() * 0.3 + 0.7, 2)
            })
            
            current_date += timedelta(days=1)
        
        # Identify peak periods
        peak_periods = [
            {"start": "2024-07-01", "end": "2024-08-31", "reason": "Summer vacation"},
            {"start": "2024-12-20", "end": "2024-01-05", "reason": "Holiday season"}
        ]
        
        # Seasonal patterns
        seasonal_patterns = {
            "spring": 0.85,
            "summer": 1.25,
            "fall": 0.95,
            "winter": 1.10
        }
        
        return DemandForecastResponse(
            route=route,
            period={"start": request.start_date, "end": request.end_date},
            forecast=forecast,
            peak_periods=peak_periods,
            seasonal_patterns=seasonal_patterns
        )
        
    except Exception as e:
        logger.error(f"Error forecasting demand: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize/timing", response_model=OptimalTimingResponse)
async def optimize_timing(request: OptimalTimingRequest):
    """Find optimal travel timing for best prices"""
    try:
        # Mock optimal timing analysis
        best_months = [
            {"month": "February", "avg_price": 285, "savings": 25},
            {"month": "November", "avg_price": 310, "savings": 15},
            {"month": "March", "avg_price": 335, "savings": 10}
        ]
        
        cheapest_days = ["Tuesday", "Wednesday", "Saturday"]
        
        optimal_booking_lead_time = 47  # days
        
        seasonal_analysis = {
            "peak_season_premium": 0.35,
            "shoulder_season_discount": 0.15,
            "off_season_discount": 0.25,
            "holiday_premium": 0.45
        }
        
        return OptimalTimingResponse(
            best_months=best_months,
            cheapest_days=cheapest_days,
            optimal_booking_lead_time=optimal_booking_lead_time,
            seasonal_analysis=seasonal_analysis
        )
        
    except Exception as e:
        logger.error(f"Error optimizing timing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/status")
async def models_status():
    """Get status of all loaded models"""
    return {
        "loaded_models": list(models.keys()),
        "total_models": len(models),
        "cache_size": len(models),
        "redis_status": "connected" if redis_client.ping() else "disconnected"
    }

@app.post("/models/retrain/{route}")
async def retrain_model(route: str):
    """Retrain model for a specific route"""
    try:
        # Remove existing model
        model_key = f"price_model_{route}"
        if model_key in models:
            del models[model_key]
        
        # Clear cache
        redis_client.delete(f"ml_model:{model_key}")
        
        # Train new model
        new_model = await train_price_model(route)
        models[model_key] = new_model
        
        return {"message": f"Model retrained for route {route}", "status": "success"}
        
    except Exception as e:
        logger.error(f"Error retraining model: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        access_log=True
    )
