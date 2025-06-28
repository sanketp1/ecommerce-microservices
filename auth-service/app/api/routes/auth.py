from fastapi import APIRouter, HTTPException, Depends

from app.models.auth import UserLogin, GoogleAuthRequest, TokenResponse
from app.models.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.oauth_service import OAuthService
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    user_service = UserService()
    auth_service = AuthService()
    
    user = await user_service.create_user(user_data)
    token = auth_service.create_jwt_token(user.id, user.email)
    
    return TokenResponse(
        access_token=token,
        user=user_service.user_to_response(user).dict()
    )

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    user_service = UserService()
    auth_service = AuthService()
    
    user = await user_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = auth_service.create_jwt_token(user.id, user.email, user.is_admin)
    
    return TokenResponse(
        access_token=token,
        user=user_service.user_to_response(user).dict()
    )

@router.post("/google", response_model=TokenResponse)
async def google_auth(auth_request: GoogleAuthRequest):
    oauth_service = OAuthService()
    auth_service = AuthService()
    user_service = UserService()
    
    user = await oauth_service.authenticate_google_user(auth_request.token)
    token = auth_service.create_jwt_token(user.id, user.email)
    
    return TokenResponse(
        access_token=token,
        user=user_service.user_to_response(user).dict()
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    user_service = UserService()
    return user_service.user_to_response(current_user) 
