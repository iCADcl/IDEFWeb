"""
Script to create initial admin user
Run this once to create the default admin account
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from auth import get_password_hash
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
admin_users = db.admin_users


async def create_default_admin():
    """Create default admin user"""
    try:
        # Check if admin already exists
        existing = await admin_users.find_one({"username": "admin"})
        
        if existing:
            print("⚠️  Admin user already exists!")
            print(f"   Username: admin")
            print(f"   Email: {existing['email']}")
            return
        
        # Create default admin
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@idef.institute",
            "username": "admin",
            "hashed_password": get_password_hash("admin123"),
            "full_name": "IDEF Administrator",
            "is_active": True,
            "is_superuser": True,
            "created_at": None,
            "last_login": None
        }
        
        from datetime import datetime
        admin_user["created_at"] = datetime.utcnow()
        
        await admin_users.insert_one(admin_user)
        
        print("✅ Default admin user created successfully!")
        print("\n📋 Credentials:")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        print(f"   Email: admin@idef.institute")
        print("\n⚠️  IMPORTANT: Change the password after first login!")
        print(f"\n🔗 Login at: /admin/login")
    
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
    finally:
        client.close()


if __name__ == "__main__":
    print("🔐 Creating default admin user...")
    asyncio.run(create_default_admin())
