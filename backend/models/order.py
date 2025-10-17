from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid


class OrderItem(BaseModel):
    """Individual item in an order"""
    product_id: str
    product_name: str
    price: float
    quantity: int = Field(default=1)


class Order(BaseModel):
    """Order model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    tax: float = Field(default=0.0)
    total: float
    currency: str = Field(default="USD")
    status: str = Field(default="pending")  # pending, paid, completed, cancelled
    payment_intent_id: Optional[str] = None  # Stripe payment intent ID
    payment_status: Optional[str] = None  # Stripe payment status
    billing_address: Optional[dict] = None
    shipping_address: Optional[dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "customer_name": "Carlos Mendoza",
                "customer_email": "carlos@example.com",
                "items": [
                    {
                        "product_id": "uuid",
                        "product_name": "Diplomado Criminal Profiling 2025",
                        "price": 540.00,
                        "quantity": 1
                    }
                ],
                "subtotal": 540.00,
                "total": 540.00,
                "status": "pending"
            }
        }


class OrderCreate(BaseModel):
    """Schema for creating an order"""
    customer_name: str = Field(..., min_length=2)
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    items: List[OrderItem]
    billing_address: Optional[dict] = None


class OrderUpdate(BaseModel):
    """Schema for updating order status"""
    status: Optional[str] = None
    payment_status: Optional[str] = None
    payment_intent_id: Optional[str] = None
