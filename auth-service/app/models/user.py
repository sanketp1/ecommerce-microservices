 
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    is_admin: bool = False
    auth_provider: Optional[str] = None
    created_at: datetime
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_admin: bool = False

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None