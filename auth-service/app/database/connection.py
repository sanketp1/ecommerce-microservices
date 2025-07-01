from motor.motor_asyncio import AsyncIOMotorClient
import logging
import ssl

from app.config.settings import settings

logger = logging.getLogger(__name__)


logger.info(f"MongoDB URL: {settings.MONGO_URL}")

# MongoDB connection with proper SSL configuration for Atlas
client = AsyncIOMotorClient(
    settings.MONGO_URL,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    maxPoolSize=10,
    minPoolSize=1,
    maxIdleTimeMS=30000,
    retryWrites=True,
    retryReads=True,
    tls=True,
    tlsAllowInvalidCertificates=False,
    tlsAllowInvalidHostnames=False
)
db = client[settings.DATABASE_NAME]
users_collection = db.users

async def init_database():
    logger.info(f"MongoDB URL: {settings.MONGO_URL}")
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
