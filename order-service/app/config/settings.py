import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # MongoDB settings
    mongo_url: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name: str = "ecommerce"
    
    # JWT settings
    jwt_secret: str = os.environ.get('JWT_SECRET', 'secret')
    jwt_algorithm: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    
    # Service URLs
    product_service_url: str = os.environ.get('PRODUCT_SERVICE_URL', 'http://product-service:8000')
    
    # Raw string from .env
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")

    PORT: int = int(os.getenv("PORT", "8000"))

    # Derived list
    @property
    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


    class Config:
        env_file = ".env"

settings = Settings()