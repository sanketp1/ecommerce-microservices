from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.dependencies import get_current_user
from app.services.order_service import OrderService
from app.models.order import OrderCreate, OrderResponse

router = APIRouter()
order_service = OrderService()

@router.get("/orders", response_model=List[dict])
async def get_orders(current_user: dict = Depends(get_current_user)):
    """Get all orders for the authenticated user"""
    user_id = current_user["user_id"]
    orders = await order_service.get_user_orders(user_id)
    return orders

@router.post("/orders", response_model=dict)
async def create_order(
    order: OrderCreate, 
    current_user: dict = Depends(get_current_user)
):
    """Create a new order"""
    # Ensure the order belongs to the authenticated user
    order.user_id = current_user["user_id"]
    
    order_id = await order_service.create_order(order)
    return {"order_id": order_id, "message": "Order created successfully"}

@router.get("/orders/{order_id}")
async def get_order(
    order_id: str, 
    current_user: dict = Depends(get_current_user)
):
    """Get a specific order by ID"""
    order = await order_service.get_order_by_id(order_id)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Ensure the order belongs to the authenticated user
    if order["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return order

@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    """Update order status"""
    # First check if order exists and belongs to user
    order = await order_service.get_order_by_id(order_id)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await order_service.update_order_status(order_id, status)
    
    if success:
        return {"message": "Order status updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to update order status")