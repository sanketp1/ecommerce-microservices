from typing import Optional
from fastapi import HTTPException
import logging

from app.database.repositories.user_repository import UserRepository
from app.models.user import UserCreate, UserInDB, UserResponse
from app.config.settings import settings
from app.services.auth_service import AuthService

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.auth_service = AuthService()
    
    async def create_user(self, user_data: UserCreate) -> UserInDB:
        if await self.user_repo.user_exists(user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = self.auth_service.hash_password(user_data.password)
        user_data.password = hashed_password
        
        return await self.user_repo.create_user(user_data)
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        user = await self.user_repo.get_user_by_email(email)
        if not user or not user.password:
            return None
        
        if not self.auth_service.verify_password(password, user.password):
            return None
        
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        return await self.user_repo.get_user_by_id(user_id)
    
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        return await self.user_repo.get_user_by_email(email)
    
    async def create_default_admin(self):
        admin_exists = await self.user_repo.user_exists(settings.DEFAULT_ADMIN_EMAIL)
        if not admin_exists:
            admin_data = UserCreate(
                email=settings.DEFAULT_ADMIN_EMAIL,
                password=settings.DEFAULT_ADMIN_PASSWORD,
                full_name="System Administrator"
            )
            admin_data.password = self.auth_service.hash_password(admin_data.password)
            await self.user_repo.create_user(admin_data, is_admin=True)
            logger.info(f"Default admin user created: {settings.DEFAULT_ADMIN_EMAIL}")
    
    async def get_all_users(self):
        return await self.user_repo.get_all_users()
    
    def user_to_response(self, user: UserInDB) -> UserResponse:
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_admin=user.is_admin
        )
