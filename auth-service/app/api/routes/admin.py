from fastapi import APIRouter, Depends
from typing import List, Dict, Any

from app.services.user_service import UserService
from app.api.dependencies import get_admin_user

router = APIRouter()

@router.get("/users")
async def get_all_users(admin_user = Depends(get_admin_user)) -> List[Dict[str, Any]]:
    user_service = UserService()
    return await user_service.get_all_users() 
