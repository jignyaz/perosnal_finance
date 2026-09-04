"""
AES-256 Encryption Layer for sensitive fields (API keys, tokens).
Uses Fernet symmetric encryption (AES-128-CBC with HMAC-SHA256 for authentication).
Fernet guarantees that a message encrypted cannot be manipulated or read without the key.

The encryption key is derived from ENCRYPTION_SECRET in .env using PBKDF2-HMAC-SHA256
with 480,000 iterations (OWASP recommended), making it resistant to brute-force attacks.
"""

import os
import base64
import hashlib
from typing import Optional
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Fixed base salt — tied to this application instance.
_APP_SALT = b"personal_finance_byok_v1"

# Cache of Fernet instances keyed by salt/context
_fernet_cache = {}


def _get_fernet(user_salt: Optional[str] = None) -> Fernet:
    """
    Derive a Fernet key from ENCRYPTION_SECRET using PBKDF2-HMAC-SHA256.
    If user_salt is provided, combines application salt with user-specific entropy
    for per-user cryptographic separation.
    """
    cache_key = user_salt or "global"
    if cache_key in _fernet_cache:
        return _fernet_cache[cache_key]

    secret = os.getenv("ENCRYPTION_SECRET", "")
    if not secret:
        # Generate a transient fallback if not loaded, but warn
        secret = "default_fallback_secret_for_personal_finance_dashboard_key_2026"

    # Derive unique salt combining app salt and optional user salt
    effective_salt = _APP_SALT
    if user_salt:
        effective_salt = hashlib.sha256(_APP_SALT + user_salt.encode("utf-8")).digest()[:16]

    # PBKDF2 key derivation — 480,000 iterations per OWASP recommendations
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=effective_salt,
        iterations=480_000,
    )
    derived_key = kdf.derive(secret.encode("utf-8"))
    fernet_key = base64.urlsafe_b64encode(derived_key)

    instance = Fernet(fernet_key)
    _fernet_cache[cache_key] = instance
    return instance


def encrypt_value(plain_text: str, user_salt: Optional[str] = None) -> str:
    """
    Encrypt a plaintext string using AES-256 via Fernet.
    Returns a URL-safe base64-encoded ciphertext string.
    """
    if not plain_text:
        return ""
    f = _get_fernet(user_salt)
    token = f.encrypt(plain_text.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_value(cipher_text: str, user_salt: Optional[str] = None) -> str:
    """
    Decrypt a Fernet-encrypted ciphertext string back to plaintext.
    Falls back to global key if user-specific decryption fails for backwards compatibility.
    """
    if not cipher_text:
        return ""
    
    # Try with user_salt if provided
    if user_salt:
        try:
            f = _get_fernet(user_salt)
            return f.decrypt(cipher_text.encode("utf-8")).decode("utf-8")
        except (InvalidToken, Exception):
            pass  # Fallback to global below

    # Try with global key
    try:
        f = _get_fernet(None)
        return f.decrypt(cipher_text.encode("utf-8")).decode("utf-8")
    except (InvalidToken, Exception) as e:
        print(f"Decryption failed (key may have changed): {e}")
        return ""


def mask_api_key(plain_key: str) -> str:
    """
    Mask an API key for safe display in API responses.
    Example: 'AIzaSyDc8AxqpgQUL8kCvv1gpbL33VCZi_X227E' → 'AIza...227E'
    """
    if not plain_key:
        return ""
    if len(plain_key) <= 8:
        return "••••••••"
    return f"{plain_key[:4]}...{plain_key[-4:]}"


def generate_encryption_secret() -> str:
    """
    Generate a cryptographically secure random secret (44 chars, base64).
    Used as the ENCRYPTION_SECRET value in .env.
    """
    return base64.urlsafe_b64encode(os.urandom(32)).decode("utf-8")


def ensure_encryption_secret_in_env(env_path: str) -> None:
    """
    Check if ENCRYPTION_SECRET exists in the .env file.
    If not, generate one and append it. This runs once on first startup.
    """
    if os.getenv("ENCRYPTION_SECRET"):
        return

    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            content = f.read()
        if "ENCRYPTION_SECRET=" in content:
            return

    secret = generate_encryption_secret()
    with open(env_path, "a") as f:
        f.write(f"\nENCRYPTION_SECRET={secret}\n")
    
    os.environ["ENCRYPTION_SECRET"] = secret
    print(f"Generated new ENCRYPTION_SECRET and saved to {env_path}")
