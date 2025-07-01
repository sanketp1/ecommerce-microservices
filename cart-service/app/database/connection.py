from pymongo import MongoClient
from pymongo.database import Database

from app.config.settings import settings
from app.utils.logger import logger

# Global MongoDB client and database
_client: MongoClient | None = None
_database: Database | None = None


def get_mongo_client() -> MongoClient:
    """Get MongoDB client singleton."""
    global _client
    if _client is None:
        _client = MongoClient(
            settings.mongo_url,
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
        # _client = MongoClient("mongodb://root:admin@localhost:27017")
        logger.info(f"Connected to MongoDB at {settings.mongo_url}")
    return _client


def get_database() -> Database:
    """Get MongoDB database singleton."""
    global _database
    if _database is None:
        client = get_mongo_client()
        _database = client[settings.database_name]
    return _database


async def initialize_database():
    """Initialize database (create indexes if needed)."""
    db = get_database()
    cart_collection = db.cart
    
    # Create index on user_id for faster queries
    cart_collection.create_index("user_id", unique=True)
    logger.info("Database initialized with indexes")


def close_database_connection():
    """Close database connection."""
    global _client
    if _client:
        _client.close()
        logger.info("Database connection closed")