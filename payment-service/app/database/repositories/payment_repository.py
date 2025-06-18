from typing import Optional, Dict, Any
from datetime import datetime

from app.database.connection import db_connection
from app.config.settings import settings

class PaymentRepository:
    """Repository for payment-related database operations"""
    
    def __init__(self):
        self.payments_collection = db_connection.get_collection(settings.PAYMENTS_COLLECTION)
        self.orders_collection = db_connection.get_collection(settings.ORDERS_COLLECTION)
        self.cart_collection = db_connection.get_collection(settings.CART_COLLECTION)
    
    def create_payment_record(self, payment_data: Dict[str, Any]) -> None:
        """Create a new payment record"""
        self.payments_collection.insert_one(payment_data)
    
    def find_payment_by_order_id(self, razorpay_order_id: str) -> Optional[Dict[str, Any]]:
        """Find payment record by Razorpay order ID"""
        return self.payments_collection.find_one({"razorpay_order_id": razorpay_order_id})
    
    def update_payment_status(self, razorpay_order_id: str, status: str, payment_id: str) -> None:
        """Update payment status"""
        self.payments_collection.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {"$set": {"status": status, "payment_id": payment_id, "updated_at": datetime.utcnow()}}
        )
    
    def create_order(self, order_data: Dict[str, Any]) -> None:
        """Create a new order"""
        self.orders_collection.insert_one(order_data)
    
    def clear_user_cart(self, user_id: str) -> None:
        """Clear user's cart after successful payment"""
        self.cart_collection.delete_one({"user_id": user_id})