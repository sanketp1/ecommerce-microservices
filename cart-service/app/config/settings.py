import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # App configuration
    app_name: str = "Cart Service"
    app_description: str = "Shopping cart management"
    app_version: str = "1.0.0"
    port: int = 8001
    
    # Database configuration
    mongo_url: str = "mongodb://localhost:27017"
    database_name: str = "ecommerce"
    
    # JWT configuration
    jwt_secret: str = "secret"
    jwt_algorithm: str = "HS256"
    
    # External services
    product_service_url: str = "http://localhost:8000"
    
    # CORS configuration
    allowed_origins: List[str] = ["*"]
    
    # Logging configuration
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create global settings instance
settings = Settings()