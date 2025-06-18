import httpx
import logging
from fastapi import HTTPException

from app.database.repositories.user_repository import UserRepository
from app.models.user import UserCreate, UserInDB

logger = logging.getLogger(__name__)

class OAuthService:
    def __init__(self):
        self.user_repo = UserRepository()
    
    async def verify_google_token(self, token: str) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
                )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid Google token")
            
            return response.json()
        except Exception as e:
            logger.error(f"Google token verification error: {str(e)}")
            raise HTTPException(status_code=401, detail="Google authentication failed")
    
    async def authenticate_google_user(self, token: str) -> UserInDB:
        google_data = await self.verify_google_token(token)
        
        email = google_data.get("email")
        name = google_data.get("name", "")
        
        if not email:
            raise HTTPException(status_code=401, detail="Email not provided by Google")
        
        user = await self.user_repo.get_user_by_email(email)
        
        if not user:
            user_data = UserCreate(
                email=email,
                full_name=name,
                password=""  # No password for OAuth users
            )
            user = await self.user_repo.create_user(user_data, auth_provider="google")
        
        return user 
