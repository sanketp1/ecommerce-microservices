from fastapi import Depends

from app.services.product_service import ProductService


def get_product_service() -> ProductService:
    """Dependency to get ProductService instance."""
    return ProductService()