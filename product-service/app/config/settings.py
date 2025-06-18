import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # App configuration
    app_name: str = "Product Service"
    app_description: str = "Product management and catalog"
    app_version: str = "1.0.0"
    port: int = 8000
    
    # Database configuration
    mongo_url: str = "mongodb://localhost:27017"
    database_name: str = "ecommerce"
    
    # CORS configuration
    allowed_origins: List[str] = ["*"]
    
    # Logging configuration
    log_level: str = "INFO"
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False
    }

# Create settings instance
settings = Settings()