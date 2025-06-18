from pydantic_settings import BaseSettings
from typing import List
from datetime import timedelta

class Settings(BaseSettings):
    # Database
    MONGO_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ecommerce"
    
    # JWT
    JWT_SECRET: str = "secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # Admin
    DEFAULT_ADMIN_EMAIL: str = "admin@ecommerce.com"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@123456"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @property
    def JWT_EXPIRATION_TIME(self) -> timedelta:
        return timedelta(hours=self.JWT_EXPIRATION_HOURS)
    
    class Config:
        env_file = ".env"

settings = Settings()