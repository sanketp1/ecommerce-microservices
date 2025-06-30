from fastapi import APIRouter, HTTPException, Depends
import httpx

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
    # The token you are sending is an OAuth access token, not an ID token.
    # You need to fetch user info from Google using this access token.
    access_token = auth_request.token
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google access token")
        userinfo = resp.json()
    
    # userinfo will have fields like 'email', 'sub' (user id), 'name', etc.
    oauth_service = OAuthService()
    auth_service = AuthService()
    user_service = UserService()
    
    # You need to implement this method in OAuthService.
    # For now, use user_service to get or create the user by email.
    email = userinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google user info missing email")
    user = await user_service.get_user_by_email(email)
    if not user:
        # Use the correct field name for full name as required by UserCreate
        user_create = UserCreate(
            email=email,
            full_name=userinfo.get("name", ""),
            # Set a random password or mark as oauth-only user
            password="google_oauth_no_password"
        )
        user = await user_service.create_user(user_create)
    token = auth_service.create_jwt_token(user.id, user.email)
    
    return TokenResponse(
        access_token=token,
        user=user_service.user_to_response(user).dict()
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    user_service = UserService()
    return user_service.user_to_response(current_user)
