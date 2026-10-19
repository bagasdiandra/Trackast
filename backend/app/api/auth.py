from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse, RefreshTokenRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & JWT"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Registrasi Pengguna Baru:
    - Mendukung pendaftaran via Email atau Username
    - Enkripsi kata sandi menggunakan bcrypt
    - Menghasilkan JWT access & refresh token langsung
    """
    if not user_in.email and not user_in.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pendaftaran membutuhkan minimal email atau username."
        )

    # Validasi email duplikat
    if user_in.email:
        existing_email = db.query(User).filter(User.email == user_in.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar. Silakan masuk atau gunakan email lain."
            )

    # Validasi username duplikat
    if user_in.username:
        existing_user = db.query(User).filter(User.username == user_in.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username sudah digunakan. Silakan pilih username lain."
            )

    # Validasi no telp duplikat
    if user_in.phone_e164:
        existing_phone = db.query(User).filter(User.phone_e164 == user_in.phone_e164).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nomor telepon sudah terdaftar."
            )

    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        phone_e164=user_in.phone_e164,
        role=user_in.role or "wisatawan",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT Tokens
    access_token = create_access_token(
        subject=new_user.id,
        claims={"role": new_user.role, "name": new_user.full_name}
    )
    refresh_token = create_refresh_token(subject=new_user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """
    Login Pengguna:
    - Input 'identifier' dapat berupa Email atau Username
    - Verifikasi hash password bcrypt
    - Menghasilkan JWT access & refresh token
    """
    identifier = login_in.identifier.strip()
    user = db.query(User).filter(
        or_(User.email == identifier, User.username == identifier)
    ).first()

    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email/username atau kata sandi tidak cocok.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun pengguna dinonaktifkan."
        )

    access_token = create_access_token(
        subject=user.id,
        claims={"role": user.role, "name": user.full_name}
    )
    refresh_token = create_refresh_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Memperbarui access token dengan menyertakan refresh token yang valid."""
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token tidak valid atau telah kedaluwarsa."
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pengguna tidak valid."
        )

    new_access_token = create_access_token(
        subject=user.id,
        claims={"role": user.role, "name": user.full_name}
    )
    new_refresh_token = create_refresh_token(subject=user.id)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Mengambil data profil pengguna yang sedang login (Protected by JWT).
    """
    return UserResponse.model_validate(current_user)

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout pengguna:
    Klien menghapus token JWT dari penyimpanan lokal (LocalStorage / Cookies).
    """
    return {"message": f"Berhasil keluar untuk pengguna {current_user.full_name}"}
