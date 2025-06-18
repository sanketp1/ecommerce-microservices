import uuid
from typing import List, Optional, Dict, Any

from app.database.repositories.product_repository import ProductRepository
from app.models.product import Product, ProductUpdate
from app.utils.logger import logger


class ProductService:
    """Service layer for product business logic."""
    
    def __init__(self):
        self.repository = ProductRepository()
    
    async def get_all_products(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all products with optional filtering."""
        try:
            filters = {}
            
            if category:
                filters["category"] = category
            
            if search:
                # If search is provided, use search functionality
                return await self.repository.search(search)
            
            return await self.repository.find_all(filters)
        except Exception as e:
            logger.error(f"Error getting products: {str(e)}")
            raise
    
    async def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get a product by ID."""
        try:
            return await self.repository.find_by_id(product_id)
        except Exception as e:
            logger.error(f"Error getting product {product_id}: {str(e)}")
            raise
    
    async def create_product(self, product: Product) -> Dict[str, Any]:
        """Create a new product."""
        try:
            # Generate ID if not provided
            if not product.id:
                product.id = str(uuid.uuid4())
            
            created_product = await self.repository.create(product)
            logger.info(f"Created product: {product.id}")
            return created_product
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            raise
    
    async def update_product(self, product_id: str, product_update: ProductUpdate) -> Optional[Dict[str, Any]]:
        """Update a product."""
        try:
            # Convert to dict and remove None values
            update_data = product_update.dict(exclude_unset=True)
            
            updated_product = await self.repository.update(product_id, update_data)
            if updated_product:
                logger.info(f"Updated product: {product_id}")
            return updated_product
        except Exception as e:
            logger.error(f"Error updating product {product_id}: {str(e)}")
            raise
    
    async def delete_product(self, product_id: str) -> bool:
        """Delete a product."""
        try:
            deleted = await self.repository.delete(product_id)
            if deleted:
                logger.info(f"Deleted product: {product_id}")
            return deleted
        except Exception as e:
            logger.error(f"Error deleting product {product_id}: {str(e)}")
            raise
    
    async def get_categories(self) -> List[str]:
        """Get all product categories."""
        try:
            return await self.repository.get_categories()
        except Exception as e:
            logger.error(f"Error getting categories: {str(e)}")
            raise
    
    async def get_products_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get products by category."""
        try:
            return await self.repository.find_by_category(category)
        except Exception as e:
            logger.error(f"Error getting products by category {category}: {str(e)}")
            raise