from typing import List, Dict, Any, Optional
from pymongo.collection import Collection
from pymongo.database import Database

from app.database.connection import get_database
from app.utils.logger import logger

class AdminRepository:
    """Repository for admin-related database operations."""
    
    def __init__(self):
        self.db: Database = get_database()
        self.users_collection: Collection = self.db.users
        self.products_collection: Collection = self.db.products
        self.orders_collection: Collection = self.db.orders
    
    # User operations
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        return self.users_collection.find_one({"id": user_id})
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users (excluding passwords)."""
        return list(self.users_collection.find({}, {"_id": 0, "password": 0}))
    
    def get_users_count(self) -> int:
        """Get total number of users."""
        return self.users_collection.count_documents({})
    
    # Product operations
    def create_product(self, product_data: Dict[str, Any]) -> bool:
        """Create a new product."""
        try:
            self.products_collection.insert_one(product_data)
            return True
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            return False
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get product by ID."""
        return self.products_collection.find_one({"id": product_id})
    
    def update_product(self, product_id: str, update_data: Dict[str, Any]) -> bool:
        """Update product."""
        try:
            result = self.products_collection.update_one(
                {"id": product_id}, 
                {"$set": update_data}
            )
            return result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating product: {e}")
            return False
    
    def delete_product(self, product_id: str) -> bool:
        """Delete product."""
        try:
            result = self.products_collection.delete_one({"id": product_id})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting product: {e}")
            return False
    
    def get_products_count(self) -> int:
        """Get total number of products."""
        return self.products_collection.count_documents({})
    
    # Order operations
    def get_all_orders(self) -> List[Dict[str, Any]]:
        """Get all orders."""
        return list(self.orders_collection.find({}, {"_id": 0}))
    
    def get_recent_orders(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get recent orders."""
        return list(self.orders_collection.find({}, {"_id": 0})
                   .sort("created_at", -1)
                   .limit(limit))
    
    def get_orders_count(self) -> int:
        """Get total number of orders."""
        return self.orders_collection.count_documents({})
    
    def get_total_revenue(self) -> float:
        """Calculate total revenue from paid orders."""
        paid_orders = self.orders_collection.find({"payment_status": "paid"})
        return sum([order.get("total", 0) for order in paid_orders])
    
    def update_order_status(self, order_id: str, status: str, updated_at: Any) -> bool:
        """Update order status."""
        try:
            result = self.orders_collection.update_one(
                {"id": order_id},
                {"$set": {"status": status, "updated_at": updated_at}}
            )
            return result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating order status: {e}")
            return False