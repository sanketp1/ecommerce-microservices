import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # App configuration
    app_name: str = os.getenv("APP_NAME", "Product Service")
    app_description: str = os.getenv("APP_DESCRIPTION", "Product management and catalog")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Database configuration
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "ecommerce")
    
    # CORS configuration
    allowed_origins: List[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")
    
    # Logging configuration
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False
    }

# Create settings instance
settings = Settings()