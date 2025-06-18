from pydantic import BaseModel
from typing import Optional


class Product(BaseModel):
    """Product model for API requests and responses."""
    
    id: Optional[str] = None
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int = 0

    class Config:
        schema_extra = {
            "example": {
                "name": "Premium Wireless Headphones",
                "description": "High-quality wireless headphones with noise cancellation",
                "price": 199.99,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                "stock": 50
            }
        }


class ProductUpdate(BaseModel):
    """Product update model for partial updates."""
    
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Updated Product Name",
                "price": 299.99,
                "stock": 25
            }
        }