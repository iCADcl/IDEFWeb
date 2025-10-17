from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class Product(BaseModel):
    """Product model for e-commerce"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=3, max_length=200)
    slug: str  # URL-friendly name
    description: str = Field(..., min_length=10)
    price: float = Field(..., gt=0)
    currency: str = Field(default="USD")
    category: str = Field(default="Diplomado")
    image_url: Optional[str] = None
    is_active: bool = Field(default=True)
    features: List[str] = Field(default_factory=list)
    duration: Optional[str] = None  # e.g., "120 horas"
    modules: Optional[int] = None
    certificate: bool = Field(default=True)
    stock: Optional[int] = None  # None = unlimited
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Diplomado Criminal Profiling 2025",
                "slug": "diplomado-criminal-profiling-2025",
                "description": "Adquiere conocimientos profundos sobre perfiles criminales",
                "price": 540.00,
                "currency": "USD",
                "category": "Diplomado",
                "features": ["100% Online", "Certificado Internacional", "Acceso de por vida"],
                "duration": "120 horas",
                "certificate": True
            }
        }


class ProductCreate(BaseModel):
    """Schema for creating a product"""
    name: str = Field(..., min_length=3, max_length=200)
    slug: str
    description: str = Field(..., min_length=10)
    price: float = Field(..., gt=0)
    currency: str = Field(default="USD")
    category: str = Field(default="Diplomado")
    image_url: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    duration: Optional[str] = None
    modules: Optional[int] = None
    stock: Optional[int] = None


class ProductUpdate(BaseModel):
    """Schema for updating a product"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    features: Optional[List[str]] = None
    stock: Optional[int] = None
