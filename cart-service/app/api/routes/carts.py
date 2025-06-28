from typing import Dict
from fastapi import APIRouter, HTTPException, Depends

from app.models.cart import CartItem, CartResponse
from app.services.cart_service import CartService
from app.api.dependencies import get_current_user, get_cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service)
):
    """Get user's shopping cart."""
    user_id = current_user["user_id"]
    return await cart_service.get_cart(user_id)


@router.post("/add", response_model=Dict[str, str])
async def add_to_cart(
    cart_item: CartItem,
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service)
):
    """Add item to cart."""
    user_id = current_user["user_id"]
    
    try:
        return await cart_service.add_to_cart(user_id, cart_item)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/remove/{product_id}", response_model=Dict[str, str])
async def remove_from_cart(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service)
):
    """Remove item from cart."""
    user_id = current_user["user_id"]
    
    try:
        return await cart_service.remove_from_cart(user_id, product_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/update/{product_id}/{quantity}", response_model=Dict[str, str])
async def update_item_quantity(
    product_id: int,
    quantity: int,
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service)
):
    """Update item quantity in cart."""
    user_id = current_user["user_id"]
    
    if quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity must be non-negative")
    
    try:
        return await cart_service.update_item_quantity(user_id, product_id, quantity)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    