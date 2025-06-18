from fastapi import APIRouter, Depends
from typing import List

from app.models.user import UserResponse
from app.services.user_service import UserService
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user = Depends(get_current_user)):
    user_service = UserService()
    return user_service.user_to_response(current_user) 
