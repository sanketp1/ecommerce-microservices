from typing import Optional, Dict, Any
from datetime import datetime

from app.database.repositories.cart_repository import CartRepository
from app.services.product_service import ProductService
from app.models.cart import Cart, CartItem, CartResponse, CartItemResponse
from app.utils.logger import logger


class CartService:
    """Service layer for cart business logic."""
    
    def __init__(self):
        self.repository = CartRepository()
        self.product_service = ProductService()
    
    async def get_cart(self, user_id: str) -> CartResponse:
        """Get user's cart with enriched product details."""
        try:
            cart = await self.repository.find_by_user_id(user_id)
            
            if not cart:
                return CartResponse(items=[], total=0.0)
            
            # Enrich cart items with product details
            enriched_items = []
            total = 0.0
            
            for item in cart["items"]:
                product = await self.product_service.get_product_details(item["product_id"])
                
                cart_item = CartItemResponse(
                    product_id=item["product_id"],
                    quantity=item["quantity"],
                    product=product
                )
                enriched_items.append(cart_item)
                
                # Calculate total
                if product:
                    total += product["price"] * item["quantity"]
            
            # Update total in database if different
            if abs(total - cart.get("total", 0)) > 0.01:
                cart["total"] = total
                updated_cart = Cart(**cart)
                await self.repository.create_or_update_cart(updated_cart)
            
            return CartResponse(items=enriched_items, total=total)
            
        except Exception as e:
            logger.error(f"Error getting cart for user {user_id}: {str(e)}")
            raise
    
    async def add_to_cart(self, user_id: str, cart_item: CartItem) -> Dict[str, str]:
        """Add item to cart."""
        try:
            # Verify product exists
            product = await self.product_service.get_product_details(cart_item.product_id)
            if not product:
                raise ValueError("Product not found")
            
            # Add item to cart
            await self.repository.add_item_to_cart(
                user_id, 
                cart_item.product_id, 
                cart_item.quantity
            )
            
            # Recalculate and update total
            await self._recalculate_cart_total(user_id)
            
            logger.info(f"Added item {cart_item.product_id} to cart for user {user_id}")
            return {"message": "Item added to cart"}
            
        except Exception as e:
            logger.error(f"Error adding item to cart for user {user_id}: {str(e)}")
            raise
    
    async def remove_from_cart(self, user_id: str, product_id: str) -> Dict[str, str]:
        """Remove item from cart."""
        try:
            removed = await self.repository.remove_item_from_cart(user_id, product_id)
            
            if not removed:
                raise ValueError("Item not found in cart")
            
            # Recalculate total
            await self._recalculate_cart_total(user_id)
            
            logger.info(f"Removed item {product_id} from cart for user {user_id}")
            return {"message": "Item removed from cart"}
            
        except Exception as e:
            logger.error(f"Error removing item from cart for user {user_id}: {str(e)}")
            raise
    
    async def update_item_quantity(self, user_id: str, product_id: str, quantity: int) -> Dict[str, str]:
        """Update item quantity in cart."""
        try:
            if quantity <= 0:
                return await self.remove_from_cart(user_id, product_id)
            
            updated = await self.repository.update_item_quantity(user_id, product_id, quantity)
            
            if not updated:
                raise ValueError("Item not found in cart")
            
            # Recalculate total
            await self._recalculate_cart_total(user_id)
            
            logger.info(f"Updated item {product_id} quantity to {quantity} for user {user_id}")
            return {"message": "Item quantity updated"}
            
        except Exception as e:
            logger.error(f"Error updating item quantity for user {user_id}: {str(e)}")
            raise
    
    async def clear_cart(self, user_id: str) -> Dict[str, str]:
        """Clear all items from cart."""
        try:
            cleared = await self.repository.clear_cart(user_id)
            
            if not cleared:
                raise ValueError("Cart not found")
            
            logger.info(f"Cleared cart for user {user_id}")
            return {"message": "Cart cleared"}
            
        except Exception as e:
            logger.error(f"Error clearing cart for user {user_id}: {str(e)}")
            raise
    
    async def _recalculate_cart_total(self, user_id: str):
        """Recalculate and update cart total."""
        cart = await self.repository.find_by_user_id(user_id)
        
        if not cart:
            return
        
        total = 0.0
        for item in cart["items"]:
            product = await self.product_service.get_product_details(item["product_id"])
            if product:
                total += product["price"] * item["quantity"]
        
        cart["total"] = total
        updated_cart = Cart(**cart)
        await self.repository.create_or_update_cart(updated_cart)