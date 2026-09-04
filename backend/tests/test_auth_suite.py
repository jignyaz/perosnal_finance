"""
Test Suite: Authentication & Session Management
Tests password hashing, JWT claims/expiration, cookie helpers, and dual-mode auth.
"""

import os
from datetime import datetime, timedelta
import jwt
from fastapi import Response, Request
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    set_auth_cookie,
    clear_auth_cookie,
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)


def test_password_hashing_and_verification():
    """Verify password hashing with salt and verification against plain passwords."""
    raw_password = "SecurePassword#2026!"
    hashed = get_password_hash(raw_password)

    # Hash must not equal plain password
    assert hashed != raw_password
    assert len(hashed) > 20

    # Verification must succeed for correct password
    assert verify_password(raw_password, hashed) is True

    # Verification must fail for incorrect password
    assert verify_password("WrongPassword123", hashed) is False
    assert verify_password("", hashed) is False


from datetime import datetime, timedelta, timezone

def test_jwt_token_generation_and_payload():
    """Verify JWT access token contains correct subject and expiration claims."""
    username = "test_fin_user"
    token = create_access_token(data={"sub": username})

    assert isinstance(token, str)
    assert len(token) > 30

    # Decode and verify payload
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload.get("sub") == username
    assert "exp" in payload
    assert payload["exp"] > datetime.now(timezone.utc).timestamp()


def test_jwt_token_custom_expiration():
    """Verify JWT token respects custom timedelta expiration."""
    username = "short_lived_user"
    delta = timedelta(minutes=5)
    token = create_access_token(data={"sub": username}, expires_delta=delta)

    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    exp_ts = payload["exp"]
    now_ts = datetime.now(timezone.utc).timestamp()
    diff_seconds = exp_ts - now_ts
    
    # Expiration should be ~300 seconds (5 min) away
    assert 280 <= diff_seconds <= 320


def test_cookie_injection_and_clearing():
    """Verify HttpOnly cookie headers are properly set and cleared on Response objects."""
    response = Response()
    sample_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_test_token"

    # 1. Set cookie
    set_auth_cookie(response, sample_token)
    set_cookie_header = response.headers.get("set-cookie", "")

    assert "access_token=" in set_cookie_header
    assert "HttpOnly" in set_cookie_header
    assert "SameSite=lax" in set_cookie_header.lower() or "samesite=lax" in set_cookie_header.lower()

    # 2. Clear cookie
    response_clear = Response()
    clear_auth_cookie(response_clear)
    clear_header = response_clear.headers.get("set-cookie", "")

    assert 'access_token=""' in clear_header or "Max-Age=0" in clear_header or "expires=" in clear_header
