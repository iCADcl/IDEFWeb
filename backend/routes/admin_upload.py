from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from auth import get_current_user
from PIL import Image
import os
import uuid
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/upload", tags=["admin-upload"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("/app/frontend/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    username: str = Depends(get_current_user)
):
    """
    Upload an image (admin only)
    
    Returns the public URL of the uploaded image
    """
    try:
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read file
        contents = await file.read()
        
        # Validate file size
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Optimize image with PIL
        try:
            img = Image.open(file_path)
            
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if too large (max 1920px width)
            max_width = 1920
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(file_path, optimize=True, quality=85)
            
        except Exception as e:
            logger.warning(f"Image optimization failed: {str(e)}")
        
        # Return public URL
        public_url = f"/uploads/{unique_filename}"
        
        logger.info(f"Image uploaded by {username}: {unique_filename}")
        
        return {
            "success": True,
            "url": public_url,
            "filename": unique_filename
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error uploading image"
        )


@router.delete("/image/{filename}")
async def delete_image(
    filename: str,
    username: str = Depends(get_current_user)
):
    """
    Delete an uploaded image (admin only)
    """
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Security check: ensure file is in upload directory
        if not str(file_path.resolve()).startswith(str(UPLOAD_DIR.resolve())):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid file path"
            )
        
        file_path.unlink()
        
        logger.info(f"Image deleted by {username}: {filename}")
        
        return {"success": True, "message": "Image deleted"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting image"
        )
