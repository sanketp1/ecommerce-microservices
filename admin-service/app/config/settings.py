import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    
    # Database
    # Example: mongodb://username:password@localhost:27017/?authSource=admin
    MONGO_URL: str = os.environ.get('MONGO_URL', 'mongodb://root:admin@localhost:27017/?authSource=admin')
    DATABASE_NAME: str = "ecommerce"
    
    # JWT
    JWT_SECRET: str = os.environ.get('JWT_SECRET', 'secret')
    JWT_ALGORITHM: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRATION_TIME: int = 3600  # 1 hour
    
    # CORS
    # Raw string from .env
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")

    # Derived list
    @property
    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    
    # Server
    PORT: int = int(os.environ.get('PORT', 8000))
    
    # Logging
    LOG_LEVEL: str = os.environ.get('LOG_LEVEL', 'INFO')
    
    class Config:
        case_sensitive = True

settings = Settings()