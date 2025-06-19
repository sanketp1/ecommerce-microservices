import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # App configuration
    app_name: str = os.getenv("APP_NAME", "Cart Service")
    app_description: str = os.getenv("APP_DESCRIPTION", "Shopping cart management")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    port: int = int(os.getenv("PORT", "8001"))
    
    # Database configuration
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "ecommerce")
    
    # JWT configuration
    jwt_secret: str = os.getenv("JWT_SECRET", "your-super-secret-key-here")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    
    # External services
    product_service_url: str = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8000")
    
    # CORS configuration
    allowed_origins: List[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")
    
    # Logging configuration
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create global settings instance
settings = Settings()