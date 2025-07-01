from typing import Optional, Dict, Any
import httpx

from app.config.settings import settings
from app.utils.logger import logger


class ProductService:
    """Service for communicating with the product service."""
    
    def __init__(self):
        self.base_url = settings.product_service_url
        # self.base_url = 'http://127.0.0.1:8080'
        self.timeout = 30.0
    
    async def get_product_details(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get product details from product service."""
        try:
            logger.info(f"Calling product service: {self.base_url}/products/{product_id}")
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/products/{product_id}")
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    logger.warning(f"Product {product_id} not found")
                    return None
                else:
                    logger.error(f"Error fetching product {product_id}: HTTP {response.status_code}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error(f"Timeout while fetching product {product_id}")
            return None
        except httpx.RequestError as e:
            logger.error(f"Request error while fetching product {product_id}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching product {product_id}: {str(e)}")
            return None
    
    async def validate_product_exists(self, product_id: str) -> bool:
        """Validate that a product exists."""
        product = await self.get_product_details(product_id)
        return product is not None
    
    async def get_multiple_products(self, product_ids: list[str]) -> Dict[str, Dict[str, Any]]:
        """Get multiple product details efficiently."""
        products = {}
        
        # Note: In a real implementation, you might want to batch these requests
        # or use a single API endpoint that accepts multiple product IDs
        for product_id in product_ids:
            product = await self.get_product_details(product_id)
            if product:
                products[product_id] = product
        
        return products