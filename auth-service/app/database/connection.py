from motor.motor_asyncio import AsyncIOMotorClient
import logging

from app.config.settings import settings

logger = logging.getLogger(__name__)

# MongoDB connection with SSL configuration for Atlas
client = AsyncIOMotorClient(
    settings.MONGO_URL,
    serverSelectionTimeoutMS=5000,
    ssl=True,
    ssl_cert_reqs='CERT_NONE'  # For Atlas connections
)
db = client[settings.DATABASE_NAME]
users_collection = db.users

async def init_database():
    """Initialize database and create default admin user"""
    try:
        # Test the connection
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas")
        
        from app.services.user_service import UserService
        user_service = UserService()
        await user_service.create_default_admin()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

def get_database():
    return db

def get_users_collection():
    return users_collection 
