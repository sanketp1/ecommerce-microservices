from fastapi import APIRouter, HTTPException, Depends
import httpx
import logging

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
    logger = logging.getLogger("google_auth")
    logger.info(f"Received Google OAuth request with token: {auth_request.token}")
    # The token you are sending is an OAuth access token, not an ID token.
    # You need to fetch user info from Google using this access token.
    access_token = auth_request.token
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        logger.info(f"Google userinfo response status: {resp.status_code}")
        if resp.status_code != 200:
            logger.error(f"Invalid Google access token. Response: {resp.text}")
            raise HTTPException(status_code=401, detail="Invalid Google access token")
        userinfo = resp.json()
        logger.info(f"Fetched userinfo from Google: {userinfo}")
    
    # userinfo will have fields like 'email', 'sub' (user id), 'name', etc.
    oauth_service = OAuthService()
    auth_service = AuthService()
    user_service = UserService()
    
    # You need to implement this method in OAuthService.
    # For now, use user_service to get or create the user by email.
    email = userinfo.get("email")
    logger.info(f"Extracted email from userinfo: {email}")
    if not email:
        logger.error("Google user info missing email")
        raise HTTPException(status_code=400, detail="Google user info missing email")
    user = await user_service.get_user_by_email(email)
    logger.info(f"User found by email: {user}")
    if not user:
        # Use the correct field name for full name as required by UserCreate
        user_create = UserCreate(
            email=email,
            full_name=userinfo.get("name", ""),
            # Set a random password or mark as oauth-only user
            password="google_oauth_no_password"
        )
        logger.info(f"Creating new user with: {user_create}")
        user = await user_service.create_user(user_create)
    token = auth_service.create_jwt_token(user.id, user.email)
    logger.info(f"Created JWT token for user {user.id}: {token}")
    
    return TokenResponse(
        access_token=token,
        user=user_service.user_to_response(user).dict()
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    user_service = UserService()
    return user_service.user_to_response(current_user)
