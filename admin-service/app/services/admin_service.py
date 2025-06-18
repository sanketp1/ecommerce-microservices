import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import HTTPException

from app.database.repositories.admin_repository import AdminRepository
from app.models.admin import (
    ProductCreate, ProductUpdate, OrderStatusUpdate, 
    DashboardResponse, DashboardStats, User, Product, Order
)
from app.utils.logger import logger

class AdminService:
    """Service layer for admin operations."""
    
    def __init__(self):
        self.admin_repository = AdminRepository()
    
    def get_dashboard_data(self) -> DashboardResponse:
        """Get admin dashboard data."""
        try:
            # Get statistics
            total_users = self.admin_repository.get_users_count()
            total_products = self.admin_repository.get_products_count()
            total_orders = self.admin_repository.get_orders_count()
            total_revenue = self.admin_repository.get_total_revenue()
            
            # Get recent orders
            recent_orders = self.admin_repository.get_recent_orders(5)
            
            stats = DashboardStats(
                total_users=total_users,
                total_products=total_products,
                total_orders=total_orders,
                total_revenue=total_revenue
            )
            
            return DashboardResponse(
                stats=stats,
                recent_orders=recent_orders
            )
        except Exception as e:
            logger.error(f"Error getting dashboard data: {e}")
            raise HTTPException(status_code=500, detail="Failed to get dashboard data")
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users."""
        try:
            return self.admin_repository.get_all_users()
        except Exception as e:
            logger.error(f"Error getting users: {e}")
            raise HTTPException(status_code=500, detail="Failed to get users")
    
    def create_product(self, product_data: ProductCreate) -> Dict[str, str]:
        """Create a new product."""
        try:
            product_dict = product_data.dict()
            product_dict["id"] = str(uuid.uuid4())
            product_dict["created_at"] = datetime.utcnow()
            
            success = self.admin_repository.create_product(product_dict)
            if not success:
                raise HTTPException(status_code=500, detail="Failed to create product")
            
            return {
                "message": "Product created successfully",
                "product_id": product_dict["id"]
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            raise HTTPException(status_code=500, detail="Failed to create product")
    
    def update_product(self, product_id: str, product_update: ProductUpdate) -> Dict[str, str]:
        """Update an existing product."""
        try:
            # Check if product exists
            existing_product = self.admin_repository.get_product_by_id(product_id)
            if not existing_product:
                raise HTTPException(status_code=404, detail="Product not found")
            
            # Prepare update data
            update_data = {k: v for k, v in product_update.dict().items() if v is not None}
            update_data["updated_at"] = datetime.utcnow()
            
            success = self.admin_repository.update_product(product_id, update_data)
            if not success:
                raise HTTPException(status_code=500, detail="Failed to update product")
            
            return {"message": "Product updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating product: {e}")
            raise HTTPException(status_code=500, detail="Failed to update product")
    
    def delete_product(self, product_id: str) -> Dict[str, str]:
        """Delete a product."""
        try:
            success = self.admin_repository.delete_product(product_id)
            if not success:
                raise HTTPException(status_code=404, detail="Product not found")
            
            return {"message": "Product deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting product: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete product")
    
    def get_all_orders(self) -> List[Dict[str, Any]]:
        """Get all orders with user information."""
        try:
            orders = self.admin_repository.get_all_orders()
            
            # Populate user information for each order
            for order in orders:
                user = self.admin_repository.get_user_by_id(order["user_id"])
                if user:
                    # Remove sensitive data
                    user.pop("password", None)
                    user.pop("_id", None)
                    order["user"] = user
            
            return orders
        except Exception as e:
            logger.error(f"Error getting orders: {e}")
            raise HTTPException(status_code=500, detail="Failed to get orders")
    
    def update_order_status(self, order_id: str, status_update: OrderStatusUpdate) -> Dict[str, str]:
        """Update order status."""
        try:
            success = self.admin_repository.update_order_status(
                order_id, 
                status_update.status, 
                datetime.utcnow()
            )
            
            if not success:
                raise HTTPException(status_code=404, detail="Order not found")
            
            return {"message": "Order status updated successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating order status: {e}")
            raise HTTPException(status_code=500, detail="Failed to update order status")