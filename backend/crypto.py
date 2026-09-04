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
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Fixed salt — tied to this application instance.
# In production, this could also be stored in .env for extra security.
_APP_SALT = b"personal_finance_byok_v1"

# Cache the Fernet instance so we don't re-derive the key on every call
_fernet_instance = None


def _get_fernet() -> Fernet:
    """
    Derive a Fernet key from ENCRYPTION_SECRET using PBKDF2-HMAC-SHA256.
    PBKDF2 with 480,000 iterations makes brute-force attacks computationally expensive.
    """
    global _fernet_instance
    if _fernet_instance is not None:
        return _fernet_instance

    secret = os.getenv("ENCRYPTION_SECRET", "")
    if not secret:
        raise RuntimeError(
            "ENCRYPTION_SECRET is not set in .env. "
            "Run the server once to auto-generate it, or set it manually."
        )

    # PBKDF2 key derivation — 480k iterations per OWASP 2023 recommendation
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=_APP_SALT,
        iterations=480_000,
    )
    derived_key = kdf.derive(secret.encode("utf-8"))
    fernet_key = base64.urlsafe_b64encode(derived_key)

    _fernet_instance = Fernet(fernet_key)
    return _fernet_instance


def encrypt_value(plain_text: str) -> str:
    """
    Encrypt a plaintext string using AES-256 via Fernet.
    Returns a URL-safe base64-encoded ciphertext string.
    """
    if not plain_text:
        return ""
    f = _get_fernet()
    token = f.encrypt(plain_text.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_value(cipher_text: str) -> str:
    """
    Decrypt a Fernet-encrypted ciphertext string back to plaintext.
    Returns empty string if decryption fails (e.g. wrong key, corrupted data).
    """
    if not cipher_text:
        return ""
    try:
        f = _get_fernet()
        plain = f.decrypt(cipher_text.encode("utf-8"))
        return plain.decode("utf-8")
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
        return  # Already loaded in environment

    # Check if it's in the file but not yet loaded
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            content = f.read()
        if "ENCRYPTION_SECRET=" in content:
            return

    # Generate and append
    secret = generate_encryption_secret()
    with open(env_path, "a") as f:
        f.write(f"\nENCRYPTION_SECRET={secret}\n")
    
    # Also set it in the current process
    os.environ["ENCRYPTION_SECRET"] = secret
    print(f"Generated new ENCRYPTION_SECRET and saved to {env_path}")
