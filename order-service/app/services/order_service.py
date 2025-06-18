from typing import List, Optional
import httpx
from app.database.repositories.order_repository import OrderRepository
from app.models.order import OrderCreate, OrderResponse
from app.config.settings import settings
from app.utils.logger import logger

class OrderService:
    def __init__(self):
        self.order_repository = OrderRepository()
    
    async def get_product_details(self, product_id: str) -> Optional[dict]:
        """Fetch product details from product service"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.product_service_url}/api/products/{product_id}"
                )
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            logger.error(f"Error fetching product details for {product_id}: {str(e)}")
            return None
    
    async def enrich_orders_with_product_details(self, orders: List[dict]) -> List[dict]:
        """Enrich order items with product details"""
        for order in orders:
            for item in order["items"]:
                product = await self.get_product_details(item["product_id"])
                if product:
                    item["product"] = product
        return orders
    
    async def create_order(self, order: OrderCreate) -> str:
        """Create a new order"""
        return await self.order_repository.create_order(order)
    
    async def get_user_orders(self, user_id: str) -> List[dict]:
        """Get all orders for a user with enriched product details"""
        orders = await self.order_repository.get_orders_by_user(user_id)
        return await self.enrich_orders_with_product_details(orders)
    
    async def get_order_by_id(self, order_id: str) -> Optional[dict]:
        """Get a specific order by ID"""
        order = await self.order_repository.get_order_by_id(order_id)
        if order:
            enriched_orders = await self.enrich_orders_with_product_details([order])
            return enriched_orders[0] if enriched_orders else None
        return None
    
    async def update_order_status(self, order_id: str, status: str) -> bool:
        """Update order status"""
        return await self.order_repository.update_order_status(order_id, status)