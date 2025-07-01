#!/usr/bin/env python3
"""
Test script to verify MongoDB Atlas connection
"""
import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config.settings import settings

async def test_mongodb_connection():
    """Test MongoDB Atlas connection"""
    print(f"Testing connection to: {settings.MONGO_URL}")
    print(f"Database name: {settings.DATABASE_NAME}")
    
    try:
        # Create client with proper SSL configuration
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
            tlsAllowInvalidHostnames=False,
            tlsInsecure=False
        )
        
        # Test the connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Test database access
        db = client[settings.DATABASE_NAME]
        collections = await db.list_collection_names()
        print(f"✅ Database '{settings.DATABASE_NAME}' accessible")
        print(f"Collections found: {collections}")
        
        # Close the connection
        client.close()
        print("✅ Connection test completed successfully")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print(f"Error type: {type(e).__name__}")
        return False
    
    return True

if __name__ == "__main__":
    # Run the test
    success = asyncio.run(test_mongodb_connection())
    sys.exit(0 if success else 1) 