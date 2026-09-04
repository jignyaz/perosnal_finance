import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request, Response
from sqlmodel import Session
from database import get_session
from models import User

# Dynamic JWT Configuration from Environment
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "a_very_long_and_extremely_secret_key_for_jwt_auth_256_bits")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 hours default

# Cryptographic password hashing context
pwd_context = CryptContext(schemes=["sha256_crypt", "bcrypt"], deprecated="auto")
# Auto-error=False enables dual authentication (Bearer Header + HttpOnly Cookie fallback)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def set_auth_cookie(response: Response, token: str, max_age: int = ACCESS_TOKEN_EXPIRE_MINUTES * 60) -> None:
    """
    Sets a secure, HttpOnly cookie with the JWT access token.
    Protects against XSS token harvesting.
    """
    is_production = os.getenv("ENVIRONMENT", "").lower() == "production"
    response.set_cookie(
        key="access_token",
        value=token,
        max_age=max_age,
        httponly=True,
        secure=is_production,  # Enforce Secure flag in production HTTPS
        samesite="lax",
        path="/"
    )


def clear_auth_cookie(response: Response) -> None:
    """Clears the access token cookie upon logout."""
    is_production = os.getenv("ENVIRONMENT", "").lower() == "production"
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=is_production,
        samesite="lax"
    )


async def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    """
    Dual-mode authentication dependency:
    1. Checks Authorization: Bearer <token> header.
    2. If absent, checks HttpOnly 'access_token' cookie.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Fallback to HttpOnly cookie if header token is missing
    jwt_token = token
    if not jwt_token:
        jwt_token = request.cookies.get("access_token")

    if not jwt_token:
        raise credentials_exception

    try:
        payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = session.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user
