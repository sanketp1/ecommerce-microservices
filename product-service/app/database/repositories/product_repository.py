from typing import List, Optional, Dict, Any
from pymongo.collection import Collection

from app.database.connection import get_database
from app.models.product import Product


class ProductRepository:
    """Repository for product data access operations."""
    
    def __init__(self):
        self.db = get_database()
        self.collection: Collection = self.db.products
    
    async def find_all(self, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Find all products with optional filters."""
        query = filters or {}
        return list(self.collection.find(query, {"_id": 0}))
    
    async def find_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Find a product by ID."""
        return self.collection.find_one({"id": product_id}, {"_id": 0})
    
    async def create(self, product: Product) -> Dict[str, Any]:
        """Create a new product."""
        product_dict = product.dict()
        self.collection.insert_one(product_dict)
        return product_dict
    
    async def update(self, product_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a product by ID."""
        # Remove None values from update_data
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if not update_data:
            return await self.find_by_id(product_id)
        
        result = self.collection.update_one(
            {"id": product_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await self.find_by_id(product_id)
        return None
    
    async def delete(self, product_id: str) -> bool:
        """Delete a product by ID."""
        result = self.collection.delete_one({"id": product_id})
        return result.deleted_count > 0
    
    async def get_categories(self) -> List[str]:
        """Get all unique product categories."""
        return self.collection.distinct("category")
    
    async def search(self, search_term: str) -> List[Dict[str, Any]]:
        """Search products by name or description."""
        query = {
            "$or": [
                {"name": {"$regex": search_term, "$options": "i"}},
                {"description": {"$regex": search_term, "$options": "i"}}
            ]
        }
        return list(self.collection.find(query, {"_id": 0}))
    
    async def find_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Find products by category."""
        return list(self.collection.find({"category": category}, {"_id": 0}))