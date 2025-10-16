from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.contact import (
    ContactSubmission,
    ContactSubmissionCreate,
    ContactSubmissionResponse
)
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["contact"])

# Database will be accessed from the main server.py
def get_db():
    from server import db
    return db

def get_contacts_collection():
    db = get_db()
    return db.contacts


@router.post("", response_model=ContactSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_submission(submission: ContactSubmissionCreate):
    """
    Create a new contact form submission.
    
    - **name**: Full name of the person submitting
    - **email**: Valid email address
    - **phone**: Optional phone number
    - **subject**: Subject of the inquiry
    - **message**: Detailed message
    """
    try:
        contacts_collection = get_contacts_collection()
        
        # Create contact submission object
        contact_data = ContactSubmission(
            **submission.model_dump(),
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Insert into MongoDB
        result = await contacts_collection.insert_one(contact_data.model_dump())
        
        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al guardar la consulta"
            )
        
        logger.info(f"Contact submission created: {contact_data.id}")
        
        return ContactSubmissionResponse(
            success=True,
            message="Consulta recibida correctamente. Nos pondremos en contacto pronto.",
            id=contact_data.id
        )
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating contact submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar la solicitud"
        )


@router.get("", response_model=List[ContactSubmission])
async def get_contact_submissions(
    limit: int = 100,
    skip: int = 0,
    status_filter: str = None
):
    """
    Get all contact submissions (admin endpoint).
    
    - **limit**: Maximum number of submissions to return
    - **skip**: Number of submissions to skip (for pagination)
    - **status_filter**: Filter by status (pending, reviewed, responded)
    """
    try:
        query = {}
        if status_filter:
            query["status"] = status_filter
        
        cursor = contacts_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        submissions = await cursor.to_list(length=limit)
        
        return [ContactSubmission(**submission) for submission in submissions]
    
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener las consultas"
        )


@router.get("/{submission_id}", response_model=ContactSubmission)
async def get_contact_submission(submission_id: str):
    """
    Get a specific contact submission by ID.
    """
    try:
        submission = await contacts_collection.find_one({"id": submission_id})
        
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consulta no encontrada"
            )
        
        return ContactSubmission(**submission)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching contact submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener la consulta"
        )


@router.patch("/{submission_id}/status")
async def update_contact_status(submission_id: str, new_status: str):
    """
    Update the status of a contact submission.
    
    - **new_status**: New status (pending, reviewed, responded)
    """
    try:
        valid_statuses = ["pending", "reviewed", "responded"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}"
            )
        
        result = await contacts_collection.update_one(
            {"id": submission_id},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consulta no encontrada"
            )
        
        return {"success": True, "message": "Estado actualizado correctamente"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el estado"
        )
