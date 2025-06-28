from pymongo import MongoClient
from pymongo.database import Database
from urllib.parse import urlparse, urlunparse

from app.config.settings import settings
from app.utils.logger import logger

class DatabaseManager:
    """MongoDB database manager."""
    
    def __init__(self):
        self._client: MongoClient = None
        self._database: Database = None

    def _mask_mongo_url(self, url: str) -> str:
        """Mask password in MongoDB URI for logging."""
        parsed = urlparse(url)
        if parsed.password:
            netloc = f"{parsed.username}:***@{parsed.hostname}"
            if parsed.port:
                netloc += f":{parsed.port}"
            masked = parsed._replace(netloc=netloc)
            return urlunparse(masked)
        return url

    def connect(self) -> Database:
        """Connect to MongoDB and return database instance."""
        try:
            # Log the URI with password masked
            logger.info(f"Connecting to MongoDB with URI: {self._mask_mongo_url(settings.MONGO_URL)}")
            self._client = MongoClient(settings.MONGO_URL)
            self._database = self._client[settings.DATABASE_NAME]
            logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")
            return self._database
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e} | URI: {self._mask_mongo_url(settings.MONGO_URL)}")
            raise
    
    def disconnect(self):
        """Disconnect from MongoDB."""
        if self._client:
            self._client.close()
            logger.info("Disconnected from MongoDB")
    
    @property
    def database(self) -> Database:
        """Get database instance."""
        if self._database is None:
            self._database = self.connect()
        return self._database

# Global database manager instance
db_manager = DatabaseManager()

def get_database() -> Database:
    """Get database instance."""
    return db_manager.database