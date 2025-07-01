import uuid
from pymongo import MongoClient
from pymongo.database import Database

from app.config.settings import settings
from app.utils.logger import logger

# Global MongoDB client and database
_client: MongoClient = None
_database: Database = None


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
    """Initialize database with sample data if empty."""
    db = get_database()
    products_collection = db.products
    
    if products_collection.count_documents({}) == 0:
        sample_products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Premium Wireless Headphones",
                "description": "High-quality wireless headphones with noise cancellation",
                "price": 199.99,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                "stock": 50
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Stylish Laptop Backpack",
                "description": "Durable and stylish backpack perfect for laptops and daily use",
                "price": 79.99,
                "category": "Accessories",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                "stock": 30
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Smart Fitness Watch",
                "description": "Advanced fitness tracking with heart rate monitoring",
                "price": 249.99,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
                "stock": 25
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Organic Coffee Blend",
                "description": "Premium organic coffee beans from sustainable farms",
                "price": 24.99,
                "category": "Food",
                "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500",
                "stock": 100
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Modern Desk Lamp",
                "description": "LED desk lamp with adjustable brightness and USB charging",
                "price": 89.99,
                "category": "Home",
                "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
                "stock": 40
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Yoga Mat Pro",
                "description": "Non-slip yoga mat for all types of yoga practice",
                "price": 49.99,
                "category": "Sports",
                "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
                "stock": 60
            }
        ]
        products_collection.insert_many(sample_products)
        logger.info("Sample products initialized")


def close_database_connection():
    """Close database connection."""
    global _client
    if _client:
        _client.close()
        logger.info("Database connection closed")