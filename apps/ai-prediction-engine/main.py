from contextlib import asynccontextmanager

import uvicorn
from app.api.routes import analytics, models, predictions
from app.core.config import settings
from app.core.database import Base, engine
from app.ml.model_manager import ModelManager
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

# Initialize model manager
model_manager = ModelManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    logger.info("🚀 Starting AI Prediction Engine")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Load ML models
    await model_manager.load_models()
    
    # Store model manager in app state
    app.state.model_manager = model_manager
    
    logger.info("✅ AI Prediction Engine ready")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down AI Prediction Engine")

app = FastAPI(
    title="SkyScout AI Prediction Engine",
    description="ML-powered flight price prediction and demand forecasting",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(models.router, prefix="/api/v1/models", tags=["models"])

@app.get("/")
async def root():
    return {
        "service": "SkyScout AI Prediction Engine",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-prediction-engine"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
