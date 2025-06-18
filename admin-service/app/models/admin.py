from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class ProductCreate(BaseModel):
    """Model for creating a product."""
    name: str
    description: Optional[str] = None
    price: float
    category: str
    inventory_count: int = 0
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    """Model for updating a product."""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    inventory_count: Optional[int] = None
    image_url: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    """Model for updating order status."""
    status: str = Field(..., description="New order status")

class DashboardStats(BaseModel):
    """Model for dashboard statistics."""
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float

class DashboardResponse(BaseModel):
    """Model for dashboard response."""
    stats: DashboardStats
    recent_orders: List[Dict[str, Any]]

class User(BaseModel):
    """User model (without sensitive data)."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: bool = False
    created_at: Optional[datetime] = None

class Product(BaseModel):
    """Product model."""
    id: str
    name: str
    description: Optional[str] = None
    price: float
    category: str
    inventory_count: int
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class Order(BaseModel):
    """Order model."""
    id: str
    user_id: str
    items: List[Dict[str, Any]]
    total: float
    status: str
    payment_status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user: Optional[User] = None  # Populated user data