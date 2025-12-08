from pydantic import BaseModel, EmailStr
from typing import Any, Dict


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginUserInfo(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUserInfo
