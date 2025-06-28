from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query

from app.models.product import Product, ProductUpdate
from app.services.product_service import ProductService
from app.api.dependencies import get_product_service
from app.utils.logger import logger
router = APIRouter(prefix="/products", tags=["products"])




@router.get("/", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    product_service: ProductService = Depends(get_product_service)
):
    
    """Get all products with optional filtering."""
    return await product_service.get_all_products(category=category, search=search)


@router.get("/categories", response_model=List[str])
async def get_categories(
    product_service: ProductService = Depends(get_product_service)
):
    """Get all product categories."""
    return await product_service.get_categories()


@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    product_service: ProductService = Depends(get_product_service)
):
    """Get a specific product by ID."""
    product = await product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=Product, status_code=201)
async def create_product(
    product: Product,
    product_service: ProductService = Depends(get_product_service)
):
    logger.info(f"Creating product: {product}")
    """Create a new product."""
    return await product_service.create_product(product)


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    product_service: ProductService = Depends(get_product_service)
):
    """Update a product."""
    updated_product = await product_service.update_product(product_id, product_update)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: str,
    product_service: ProductService = Depends(get_product_service)
):
    """Delete a product."""
    deleted = await product_service.delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")