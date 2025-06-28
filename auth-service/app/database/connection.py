from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import logging

from app.config.settings import settings

logger = logging.getLogger(__name__)

# MongoDB connection
client = MongoClient(settings.MONGO_URL)
# client = MongoClient("mongodb://root:admin@localhost:27017")
db = client[settings.DATABASE_NAME]
users_collection = db.users

async def init_database():
    """Initialize database and create default admin user"""
    from app.services.user_service import UserService
    
    user_service = UserService()
    await user_service.create_default_admin()
    logger.info("Database initialized successfully")

def get_database():
    return db

def get_users_collection():
    return users_collection 
