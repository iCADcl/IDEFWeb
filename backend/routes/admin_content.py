from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.landing_content import LandingContent, LandingContentUpdate
from auth import get_current_user
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/content", tags=["admin-content"])


def get_db():
    from server import db
    return db


def get_content_collection():
    db = get_db()
    return db.landing_content


@router.get("/landing", response_model=LandingContent)
async def get_landing_content(username: str = Depends(get_current_user)):
    """
    Get current landing page content
    """
    try:
        content_collection = get_content_collection()
        content = await content_collection.find_one()
        
        if not content:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Landing content not found. Please initialize content first."
            )
        
        return LandingContent(**content)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching landing content: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching landing content"
        )


@router.put("/landing", response_model=LandingContent)
async def update_landing_content(
    content_update: LandingContentUpdate,
    username: str = Depends(get_current_user)
):
    """
    Update landing page content (admin only)
    """
    try:
        content_collection = get_content_collection()
        
        # Get existing content
        existing = await content_collection.find_one()
        
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Landing content not found"
            )
        
        # Update only provided fields
        update_data = content_update.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        result = await content_collection.update_one(
            {"id": existing["id"]},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            logger.warning("No changes made to landing content")
        
        # Get updated content
        updated = await content_collection.find_one({"id": existing["id"]})
        
        logger.info(f"Landing content updated by {username}")
        
        return LandingContent(**updated)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating landing content: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating landing content"
        )


@router.post("/landing/initialize")
async def initialize_landing_content(username: str = Depends(get_current_user)):
    """
    Initialize landing content with default values (run once)
    """
    try:
        content_collection = get_content_collection()
        
        # Check if content already exists
        existing = await content_collection.find_one()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Landing content already initialized"
            )
        
        # Create default content from current landing page
        from mock import heroData, statsData, servicesData, trainingData, innovationData, testimonialsData
        
        default_content = LandingContent(
            hero={
                "title": heroData["title"],
                "subtitle": heroData["subtitle"],
                "image": heroData["image"]
            },
            stats=[
                {"label": stat["label"], "value": stat["value"], "order": i}
                for i, stat in enumerate(statsData)
            ],
            services=[
                {
                    "title": s["title"],
                    "description": s["description"],
                    "icon": s["icon"],
                    "image": s["image"],
                    "order": i
                }
                for i, s in enumerate(servicesData)
            ],
            training_title=trainingData["title"],
            training_subtitle=trainingData["subtitle"],
            training_image=trainingData["image"],
            training_programs=[
                {
                    "name": p["name"],
                    "target": p["target"],
                    "duration": p["duration"],
                    "description": p["description"],
                    "order": i
                }
                for i, p in enumerate(trainingData["programs"])
            ],
            innovation_title=innovationData["title"],
            innovation_subtitle=innovationData["subtitle"],
            innovation_images=innovationData["images"],
            technologies=[
                {
                    "name": t["name"],
                    "description": t["description"],
                    "icon": t["icon"],
                    "order": i
                }
                for i, t in enumerate(innovationData["technologies"])
            ],
            testimonials=[
                {
                    "name": t["name"],
                    "role": t["role"],
                    "content": t["content"],
                    "rating": t["rating"],
                    "order": i
                }
                for i, t in enumerate(testimonialsData)
            ]
        )
        
        await content_collection.insert_one(default_content.model_dump())
        
        logger.info(f"Landing content initialized by {username}")
        
        return {"success": True, "message": "Landing content initialized successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error initializing landing content: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error initializing landing content: {str(e)}"
        )
