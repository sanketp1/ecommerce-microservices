from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class PaymentOrder(BaseModel):
    """Payment order creation model"""
    amount: float
    currency: str = "INR"

class PaymentVerification(BaseModel):
    """Payment verification model"""
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class CartItem(BaseModel):
    """Cart item model"""
    product_id: str
    name: str
    price: float
    quantity: int
    image_url: Optional[str] = None

class Cart(BaseModel):
    """Cart model"""
    user_id: str
    items: List[CartItem]
    total: float
    created_at: datetime
    updated_at: datetime

class PaymentRecord(BaseModel):
    """Payment record model"""
    id: str
    user_id: str
    razorpay_order_id: str
    amount: float
    currency: str
    status: str
    cart_items: List[Dict[str, Any]]
    created_at: datetime
    updated_at: Optional[datetime] = None
    payment_id: Optional[str] = None

class Order(BaseModel):
    """Order model"""
    id: str
    user_id: str
    items: List[Dict[str, Any]]
    total: float
    payment_id: str
    payment_status: str
    status: str
    created_at: datetime