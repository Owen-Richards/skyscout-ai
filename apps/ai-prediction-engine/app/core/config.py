import os
from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "SkyScout AI Prediction Engine"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    PORT: int = 8002

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/skyscout_ai"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # ML Models
    MODEL_CACHE_DIR: str = "./models"
    MODEL_UPDATE_INTERVAL: int = 3600  # 1 hour
    
    # External APIs
    FLIGHT_SERVICE_URL: str = "http://localhost:3001"
    WEATHER_API_KEY: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/2"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/3"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
