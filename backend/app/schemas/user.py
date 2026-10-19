from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Nama lengkap pengguna")
    email: Optional[str] = Field(None, description="Alamat email valid")
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="Username unik")
    password: str = Field(..., min_length=8, description="Kata sandi minimal 8 karakter")
    phone_e164: Optional[str] = Field(None, description="Nomor telepon format E.164")
    role: Optional[str] = Field("wisatawan", description="Peran: wisatawan, pemandu, admin")

class UserLogin(BaseModel):
    identifier: str = Field(..., description="Email atau username")
    password: str = Field(..., description="Kata sandi")

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: Optional[str] = None
    username: Optional[str] = None
    role: str
    phone_e164: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class RefreshTokenRequest(BaseModel):
    refresh_token: str
