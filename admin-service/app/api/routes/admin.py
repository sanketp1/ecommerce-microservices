from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

from app.api.dependencies import get_admin_user
from app.services.admin_service import AdminService
from app.models.admin import (
    ProductCreate, ProductUpdate, OrderStatusUpdate,
    DashboardResponse
)

router = APIRouter()
admin_service = AdminService()

@router.get("/admin/dashboard", response_model=DashboardResponse)
async def get_admin_dashboard(admin_user: dict = Depends(get_admin_user)):
    """Get admin dashboard data including statistics and recent orders."""
    return admin_service.get_dashboard_data()

@router.get("/admin/users")
async def get_all_users(admin_user: dict = Depends(get_admin_user)) -> List[Dict[str, Any]]:
    """Get all users (excluding sensitive information)."""
    return admin_service.get_all_users()

@router.post("/admin/products")
async def create_product(
    product: ProductCreate, 
    admin_user: dict = Depends(get_admin_user)
) -> Dict[str, str]:
    """Create a new product."""
    return admin_service.create_product(product)

@router.put("/admin/products/{product_id}")
async def update_product(
    product_id: str, 
    product_update: ProductUpdate, 
    admin_user: dict = Depends(get_admin_user)
) -> Dict[str, str]:
    """Update an existing product."""
    return admin_service.update_product(product_id, product_update)

@router.delete("/admin/products/{product_id}")
async def delete_product(
    product_id: str, 
    admin_user: dict = Depends(get_admin_user)
) -> Dict[str, str]:
    """Delete a product."""
    return admin_service.delete_product(product_id)

@router.get("/admin/orders")
async def get_all_orders(admin_user: dict = Depends(get_admin_user)) -> List[Dict[str, Any]]:
    """Get all orders with user information."""
    return admin_service.get_all_orders()

@router.put("/admin/orders/{order_id}/status")
async def update_order_status(
    order_id: str, 
    status_update: OrderStatusUpdate, 
    admin_user: dict = Depends(get_admin_user)
) -> Dict[str, str]:
    """Update order status."""
    return admin_service.update_order_status(order_id, status_update)