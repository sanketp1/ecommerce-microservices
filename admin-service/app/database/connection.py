from pymongo import MongoClient
from pymongo.database import Database

from app.config.settings import settings
from app.utils.logger import logger

class DatabaseManager:
    """MongoDB database manager."""
    
    def __init__(self):
        self._client: MongoClient = None
        self._database: Database = None
    
    def connect(self) -> Database:
        """Connect to MongoDB and return database instance."""
        try:
            self._client = MongoClient(settings.MONGO_URL)
            self._database = self._client[settings.DATABASE_NAME]
            logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")
            return self._database
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
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