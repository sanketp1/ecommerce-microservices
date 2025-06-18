import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB settings
    mongo_url: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name: str = "ecommerce"
    
    # JWT settings
    jwt_secret: str = os.environ.get('JWT_SECRET', 'secret')
    jwt_algorithm: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    
    # Service URLs
    product_service_url: str = os.environ.get('PRODUCT_SERVICE_URL', 'http://product-service:8000')
    
    class Config:
        env_file = ".env"

settings = Settings()