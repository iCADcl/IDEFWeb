from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class AdminUser(BaseModel):
    """Admin user model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    username: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None


class AdminUserCreate(BaseModel):
    """Schema for creating admin user"""
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


class AdminUserLogin(BaseModel):
    """Schema for admin login"""
    username: str
    password: str


class Token(BaseModel):
    """Token response"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token data"""
    username: Optional[str] = None
