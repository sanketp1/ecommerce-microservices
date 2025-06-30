import jwt
from datetime import datetime
from fastapi import HTTPException

from app.config.settings import settings
from app.models.auth import TokenPayload
from app.utils.security import verify_password, hash_password

class AuthService:
    def __init__(self):
        self.secret = settings.JWT_SECRET
        self.algorithm = settings.JWT_ALGORITHM
        self.expiration_time = settings.JWT_EXPIRATION_TIME
    
    def create_jwt_token(self, user_id: str, email: str, is_admin: bool = False) -> str:
        payload = {
            "user_id": user_id,
            "email": email,
            'is_admin': is_admin,
            "exp": datetime.utcnow() + self.expiration_time
        }
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)
    
    def verify_jwt_token(self, token: str) -> TokenPayload:
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return TokenPayload(**payload)
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        return verify_password(password, hashed_password)
    
    def hash_password(self, password: str) -> str:
        return hash_password(password) 
