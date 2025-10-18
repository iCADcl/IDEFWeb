from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models.order import Order
from auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])


def get_db():
    from server import db
    return db


def get_orders_collection():
    db = get_db()
    return db.orders


@router.get("", response_model=List[Order])
async def get_all_orders(
    username: str = Depends(get_current_user),
    status_filter: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    skip: int = 0
):
    """
    Get all orders (admin only)
    
    - **status_filter**: Filter by status (pending, paid, completed, cancelled)
    - **limit**: Maximum number of orders to return
    - **skip**: Number of orders to skip (pagination)
    """
    try:
        orders_collection = get_orders_collection()
        
        query = {}
        if status_filter:
            query["status"] = status_filter
        
        cursor = orders_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)
        
        return [Order(**order) for order in orders]
    
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching orders"
        )


@router.get("/stats")
async def get_order_stats(username: str = Depends(get_current_user)):
    """
    Get order statistics (admin only)
    """
    try:
        orders_collection = get_orders_collection()
        
        total_orders = await orders_collection.count_documents({})
        paid_orders = await orders_collection.count_documents({"status": "paid"})
        pending_orders = await orders_collection.count_documents({"status": "pending"})
        
        # Calculate total revenue
        pipeline = [
            {"$match": {"status": "paid"}},
            {"$group": {"_id": None, "total_revenue": {"$sum": "$total"}}}
        ]
        revenue_result = await orders_collection.aggregate(pipeline).to_list(1)
        total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
        
        return {
            "total_orders": total_orders,
            "paid_orders": paid_orders,
            "pending_orders": pending_orders,
            "total_revenue": round(total_revenue, 2)
        }
    
    except Exception as e:
        logger.error(f"Error fetching order stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching order stats"
        )


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    new_status: str,
    username: str = Depends(get_current_user)
):
    """
    Update order status (admin only)
    """
    try:
        orders_collection = get_orders_collection()
        
        valid_statuses = ["pending", "paid", "completed", "cancelled"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        result = await orders_collection.update_one(
            {"id": order_id},
            {"$set": {"status": new_status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        logger.info(f"Order {order_id} status updated to {new_status} by {username}")
        
        return {"success": True, "message": "Order status updated"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating order status"
        )
