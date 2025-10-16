from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import uuid


class ContactSubmission(BaseModel):
    """Contact form submission model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre es requerido')
        return v.strip()

    @field_validator('subject')
    @classmethod
    def validate_subject(cls, v):
        if not v or not v.strip():
            raise ValueError('El asunto es requerido')
        return v.strip()

    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError('El mensaje es requerido')
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Carlos Mendoza",
                "email": "carlos@example.com",
                "phone": "+1 555-123-4567",
                "subject": "Consulta sobre servicios forenses",
                "message": "Necesito información sobre análisis de ADN para un caso legal."
            }
        }


class ContactSubmissionCreate(BaseModel):
    """Schema for creating a new contact submission"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre es requerido')
        return v.strip()

    @field_validator('subject')
    @classmethod
    def validate_subject(cls, v):
        if not v or not v.strip():
            raise ValueError('El asunto es requerido')
        return v.strip()

    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError('El mensaje es requerido')
        return v.strip()


class ContactSubmissionResponse(BaseModel):
    """Response schema for contact submission"""
    success: bool
    message: str
    id: Optional[str] = None
