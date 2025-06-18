from typing import Optional, Dict, Any
from pymongo.collection import Collection
from datetime import datetime

from app.database.connection import get_database
from app.models.cart import Cart


class CartRepository:
    """Repository for cart data access operations."""
    
    def __init__(self):
        self.db = get_database()
        self.collection: Collection = self.db.cart
    
    async def find_by_user_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Find a cart by user ID."""
        return self.collection.find_one({"user_id": user_id}, {"_id": 0})
    
    async def create_or_update_cart(self, cart: Cart) -> Dict[str, Any]:
        """Create or update a cart."""
        cart_dict = cart.dict()
        cart_dict["updated_at"] = datetime.utcnow()
        
        self.collection.replace_one(
            {"user_id": cart.user_id},
            cart_dict,
            upsert=True
        )
        return cart_dict
    
    async def delete_cart(self, user_id: str) -> bool:
        """Delete a cart by user ID."""
        result = self.collection.delete_one({"user_id": user_id})
        return result.deleted_count > 0
    
    async def add_item_to_cart(self, user_id: str, product_id: str, quantity: int) -> bool:
        """Add an item to cart or update quantity if exists."""
        cart = await self.find_by_user_id(user_id)
        
        if not cart:
            # Create new cart
            new_cart = Cart(
                user_id=user_id,
                items=[{"product_id": product_id, "quantity": quantity}]
            )
            await self.create_or_update_cart(new_cart)
            return True
        
        # Update existing cart
        existing_item = None
        for item in cart["items"]:
            if item["product_id"] == product_id:
                existing_item = item
                break
        
        if existing_item:
            existing_item["quantity"] += quantity
        else:
            cart["items"].append({"product_id": product_id, "quantity": quantity})
        
        updated_cart = Cart(**cart)
        await self.create_or_update_cart(updated_cart)
        return True
    
    async def remove_item_from_cart(self, user_id: str, product_id: str) -> bool:
        """Remove an item from cart."""
        cart = await self.find_by_user_id(user_id)
        
        if not cart:
            return False
        
        original_count = len(cart["items"])
        cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
        
        if len(cart["items"]) == original_count:
            return False  # Item not found
        
        updated_cart = Cart(**cart)
        await self.create_or_update_cart(updated_cart)
        return True
    
    async def update_item_quantity(self, user_id: str, product_id: str, quantity: int) -> bool:
        """Update quantity of an item in cart."""
        cart = await self.find_by_user_id(user_id)
        
        if not cart:
            return False
        
        for item in cart["items"]:
            if item["product_id"] == product_id:
                item["quantity"] = quantity
                break
        else:
            return False  # Item not found
        
        updated_cart = Cart(**cart)
        await self.create_or_update_cart(updated_cart)
        return True
    
    async def clear_cart(self, user_id: str) -> bool:
        """Clear all items from cart."""
        cart = await self.find_by_user_id(user_id)
        
        if not cart:
            return False
        
        cart["items"] = []
        cart["total"] = 0.0
        
        updated_cart = Cart(**cart)
        await self.create_or_update_cart(updated_cart)
        return True