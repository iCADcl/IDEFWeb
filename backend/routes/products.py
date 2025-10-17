from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from models.product import Product, ProductCreate, ProductUpdate
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/products", tags=["products"])


def get_db():
    from server import db
    return db


def get_products_collection():
    db = get_db()
    return db.products


@router.get("", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    is_active: bool = True,
    limit: int = Query(default=100, le=100),
    skip: int = 0
):
    """
    Get all products with optional filtering.
    
    - **category**: Filter by category
    - **is_active**: Show only active products (default: True)
    - **limit**: Maximum number of products to return
    - **skip**: Number of products to skip (pagination)
    """
    try:
        products_collection = get_products_collection()
        
        query = {"is_active": is_active}
        if category:
            query["category"] = category
        
        cursor = products_collection.find(query).sort("name", 1).skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)
        
        return [Product(**product) for product in products]
    
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener los productos"
        )


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """
    Get a specific product by ID.
    """
    try:
        products_collection = get_products_collection()
        product = await products_collection.find_one({"id": product_id})
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        return Product(**product)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el producto"
        )


@router.get("/slug/{slug}", response_model=Product)
async def get_product_by_slug(slug: str):
    """
    Get a specific product by slug.
    """
    try:
        products_collection = get_products_collection()
        product = await products_collection.find_one({"slug": slug})
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        return Product(**product)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product by slug: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el producto"
        )


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    """
    Create a new product (admin only).
    """
    try:
        products_collection = get_products_collection()
        
        # Check if slug already exists
        existing = await products_collection.find_one({"slug": product.slug})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un producto con este slug"
            )
        
        product_data = Product(**product.model_dump())
        await products_collection.insert_one(product_data.model_dump())
        
        logger.info(f"Product created: {product_data.id}")
        return product_data
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el producto"
        )


@router.patch("/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    """
    Update a product (admin only).
    """
    try:
        products_collection = get_products_collection()
        
        # Get existing product
        existing_product = await products_collection.find_one({"id": product_id})
        if not existing_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        # Update only provided fields
        update_data = product_update.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        result = await products_collection.update_one(
            {"id": product_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo actualizar el producto"
            )
        
        # Get updated product
        updated_product = await products_collection.find_one({"id": product_id})
        return Product(**updated_product)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el producto"
        )


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """
    Delete a product (admin only).
    """
    try:
        products_collection = get_products_collection()
        
        result = await products_collection.delete_one({"id": product_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        
        return {"success": True, "message": "Producto eliminado correctamente"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el producto"
        )


from datetime import datetime
