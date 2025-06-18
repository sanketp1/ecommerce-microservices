from typing import List, Optional
from app.database.connection import get_database
from app.models.order import OrderCreate, OrderResponse
from app.utils.logger import logger
import uuid
from datetime import datetime

class OrderRepository:
    def __init__(self):
        self.db = get_database()
        self.collection = self.db.orders
    
    async def create_order(self, order: OrderCreate) -> str:
        """Create a new order"""
        try:
            order_id = str(uuid.uuid4())
            order_doc = {
                "order_id": order_id,
                "user_id": order.user_id,
                "items": [item.dict() for item in order.items],
                "total_amount": order.total_amount,
                "status": order.status,
                "created_at": datetime.utcnow(),
                "updated_at": None
            }
            
            result = self.collection.insert_one(order_doc)
            logger.info(f"Order created with ID: {order_id}")
            return order_id
        except Exception as e:
            logger.error(f"Error creating order: {str(e)}")
            raise
    
    async def get_orders_by_user(self, user_id: str) -> List[dict]:
        """Get all orders for a specific user"""
        try:
            orders = list(self.collection.find(
                {"user_id": user_id}, 
                {"_id": 0}
            ))
            return orders
        except Exception as e:
            logger.error(f"Error fetching orders for user {user_id}: {str(e)}")
            raise
    
    async def get_order_by_id(self, order_id: str) -> Optional[dict]:
        """Get a specific order by ID"""
        try:
            order = self.collection.find_one(
                {"order_id": order_id}, 
                {"_id": 0}
            )
            return order
        except Exception as e:
            logger.error(f"Error fetching order {order_id}: {str(e)}")
            raise
    
    async def update_order_status(self, order_id: str, status: str) -> bool:
        """Update order status"""
        try:
            result = self.collection.update_one(
                {"order_id": order_id},
                {
                    "$set": {
                        "status": status,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                logger.info(f"Order {order_id} status updated to {status}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error updating order {order_id}: {str(e)}")
            raise