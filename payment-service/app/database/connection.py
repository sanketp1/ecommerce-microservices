from pymongo import MongoClient
from app.config.settings import settings

class DatabaseConnection:
    """MongoDB connection manager"""
    
    _instance = None
    _client = None
    _database = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._client = MongoClient(settings.MONGO_URL)
            cls._database = cls._client[settings.DATABASE_NAME]
        return cls._instance
    
    @property
    def client(self):
        return self._client
    
    @property
    def database(self):
        return self._database
    
    def get_collection(self, collection_name: str):
        """Get a collection from the database"""
        return self._database[collection_name]
    
    def close(self):
        """Close database connection"""
        if self._client:
            self._client.close()

# Global database instance
db_connection = DatabaseConnection()