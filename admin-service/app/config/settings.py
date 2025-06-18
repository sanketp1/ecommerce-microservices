import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    
    # Database
    MONGO_URL: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    DATABASE_NAME: str = "ecommerce"
    
    # JWT
    JWT_SECRET: str = os.environ.get('JWT_SECRET', 'secret')
    JWT_ALGORITHM: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRATION_TIME: int = 3600  # 1 hour
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Server
    PORT: int = int(os.environ.get('PORT', 8000))
    
    # Logging
    LOG_LEVEL: str = os.environ.get('LOG_LEVEL', 'INFO')
    
    class Config:
        case_sensitive = True

settings = Settings()