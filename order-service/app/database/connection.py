from pymongo import MongoClient
from app.config.settings import settings
from app.utils.logger import logger

class Database:
    client: MongoClient = None
    db = None

database = Database()

def get_database():
    return database.db

def connect_to_mongo():
    """Create database connection"""
    try:
        database.client = MongoClient(
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
        database.db = database.client[settings.db_name]
        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        logger.info("Disconnected from MongoDB")

# Initialize connection
connect_to_mongo()