from fastapi import APIRouter, HTTPException, status, Depends
from models.admin import AdminUser, AdminUserCreate, AdminUserLogin, Token
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])


def get_db():
    from server import db
    return db


def get_admin_users_collection():
    db = get_db()
    return db.admin_users


@router.post("/register", response_model=dict)
async def register_admin(admin: AdminUserCreate):
    """
    Register a new admin user (only accessible by superusers in production)
    """
    try:
        admin_users = get_admin_users_collection()
        
        # Check if username already exists
        existing = await admin_users.find_one({"username": admin.username})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
        
        # Check if email already exists
        existing_email = await admin_users.find_one({"email": admin.email})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
        
        # Create admin user
        admin_user = AdminUser(
            email=admin.email,
            username=admin.username,
            hashed_password=get_password_hash(admin.password),
            full_name=admin.full_name
        )
        
        await admin_users.insert_one(admin_user.model_dump())
        
        logger.info(f"Admin user created: {admin.username}")
        
        return {"success": True, "message": "Admin user created successfully", "username": admin.username}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating admin user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating admin user"
        )


@router.post("/login", response_model=Token)
async def login_admin(credentials: AdminUserLogin):
    """
    Login admin user and get access token
    """
    try:
        admin_users = get_admin_users_collection()
        
        # Find admin user
        admin = await admin_users.find_one({"username": credentials.username})
        
        if not admin or not verify_password(credentials.password, admin["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not admin.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        # Update last login
        await admin_users.update_one(
            {"username": credentials.username},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create access token
        access_token = create_access_token(data={"sub": admin["username"]})
        
        logger.info(f"Admin logged in: {credentials.username}")
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during login"
        )


@router.get("/me")
async def get_current_admin(username: str = Depends(get_current_user)):
    """
    Get current authenticated admin user info
    """
    try:
        admin_users = get_admin_users_collection()
        admin = await admin_users.find_one({"username": username})
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin user not found"
            )
        
        # Remove sensitive data
        admin.pop("hashed_password", None)
        admin.pop("_id", None)
        
        return admin
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting admin info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting admin info"
        )
