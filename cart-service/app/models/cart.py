from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class CartItem(BaseModel):
    """Cart item model for API requests."""
    
    product_id: int
    quantity: int

    class Config:
        schema_extra = {
            "example": {
                "product_id": 1,
                "quantity": 2
            }
        }


class CartItemResponse(BaseModel):
    """Cart item model for API responses with product details."""
    
    product_id: int
    quantity: int
    product: Optional[Dict[str, Any]] = None

    class Config:
        schema_extra = {
            "example": {
                "product_id": 1,
                "quantity": 2,
                "product": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "name": "Premium Wireless Headphones",
                    "price": 199.99,
                    "image_url": "https://example.com/image.jpg"
                }
            }
        }


class Cart(BaseModel):
    """Cart model for database operations."""
    
    user_id: str
    items: List[Dict[str, Any]] = []
    total: float = 0.0
    updated_at: Optional[datetime] = None

    class Config:
        schema_extra = {
            "example": {
                "user_id": "user123",
                "items": [
                    {
                        "product_id": int,
                        "quantity": 2
                    }
                ],
                "total": 399.98,
                "updated_at": "2024-01-01T12:00:00Z"
            }
        }


class CartResponse(BaseModel):
    """Cart response model for API responses."""
    
    items: List[CartItemResponse] = []
    total: float = 0.0

    class Config:
        schema_extra = {
            "example": {
                "items": [
                    {
                        "product_id": 1,
                        "quantity": 2,
                        "product": {
                            "id": "550e8400-e29b-41d4-a716-446655440000",
                            "name": "Premium Wireless Headphones",
                            "price": 199.99
                        }
                    }
                ],
                "total": 399.98
            }
        }