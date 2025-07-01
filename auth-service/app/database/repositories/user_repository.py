from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

from app.database.connection import get_users_collection
from app.models.user import UserInDB, UserCreate

class UserRepository:
    def __init__(self):
        self.collection = get_users_collection()
    
    async def create_user(self, user_data: UserCreate, is_admin: bool = False, auth_provider: Optional[str] = None) -> UserInDB:
        user_id = str(uuid.uuid4())
        user_dict = {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "is_admin": is_admin,
            "created_at": datetime.utcnow()
        }
        
        if hasattr(user_data, 'password') and user_data.password:
            user_dict["password"] = user_data.password
            
        if auth_provider:
            user_dict["auth_provider"] = auth_provider
        
        await self.collection.insert_one(user_dict)
        return UserInDB(**user_dict)
    
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        user_data = await self.collection.find_one({"email": email})
        if user_data:
            user_data.pop("_id", None)
            return UserInDB(**user_data)
        return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        user_data = await self.collection.find_one({"id": user_id})
        if user_data:
            user_data.pop("_id", None)
            return UserInDB(**user_data)
        return None
    
    async def get_all_users(self) -> List[Dict[str, Any]]:
        cursor = self.collection.find({}, {"_id": 0, "password": 0})
        users = await cursor.to_list(length=None)
        return users
    
    async def user_exists(self, email: str) -> bool:
        user = await self.collection.find_one({"email": email})
        return user is not None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        result = await self.collection.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        return result.modified_count > 0 
