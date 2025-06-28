import os
from typing import Optional, List

class Settings:
    """Application settings"""
    
    # Database settings
    MONGO_URL: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    
    # JWT settings
    JWT_SECRET: str = os.environ.get('JWT_SECRET', 'secret')
    JWT_ALGORITHM: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    
    # Razorpay settings
    RAZORPAY_KEY_ID: str = os.environ.get('RAZORPAY_KEY_ID', '')
    RAZORPAY_KEY_SECRET: str = os.environ.get('RAZORPAY_KEY_SECRET', '')
    
    # Service URLs
    CART_SERVICE_URL: str = os.environ.get('CART_SERVICE_URL', 'http://cart-service:8000')

    # Raw string from .env
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")

    # Derived list
    @property
    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    
    # Database name
    DATABASE_NAME: str = 'ecommerce'
    
    # Collections
    PAYMENTS_COLLECTION: str = 'payments'
    ORDERS_COLLECTION: str = 'orders'
    CART_COLLECTION: str = 'cart'

settings = Settings()