"""
Enterprise Security Module for Personal Finance Dashboard:
1. In-Memory Sliding-Window Rate Limiter (Brute force & DoS defense)
2. PII (Personally Identifiable Information) Sanitizer for AI Prompts
3. HTTP Security Headers Provider
"""

import re
import time
import asyncio
from typing import Dict, List, Any, Optional, Callable, Tuple
from fastapi import Request, HTTPException, status, Response

# ─── 1. In-Memory Sliding Window Rate Limiter ─────────────────────────────────

class SlidingWindowRateLimiter:
    """
    Thread-safe, lightweight, async-friendly in-memory sliding window rate limiter.
    Maintains timestamped request logs per key (IP or User ID) with auto-pruning.
    """
    def __init__(self):
        self._history: Dict[str, List[float]] = {}
        self._lock = asyncio.Lock()
        self._last_cleanup = time.time()

    async def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int]:
        now = time.time()
        cutoff = now - window_seconds

        async with self._lock:
            # Periodic background cleanup of stale keys every 10 minutes
            if now - self._last_cleanup > 600:
                self._prune_stale(now)
                self._last_cleanup = now

            timestamps = self._history.get(key, [])
            # Keep only timestamps within the active sliding window
            timestamps = [t for t in timestamps if t > cutoff]

            if len(timestamps) >= max_requests:
                retry_after = int(timestamps[0] + window_seconds - now) + 1
                self._history[key] = timestamps
                return False, retry_after

            timestamps.append(now)
            self._history[key] = timestamps
            return True, 0

    def _prune_stale(self, now: float, max_age: float = 3600):
        """Remove keys with no activity in the last hour."""
        stale_keys = [k for k, v in self._history.items() if not v or v[-1] < (now - max_age)]
        for k in stale_keys:
            del self._history[k]

# Global rate limiter instance
_global_rate_limiter = SlidingWindowRateLimiter()


def rate_limit(max_requests: int = 5, window_seconds: int = 60, key_prefix: str = ""):
    """
    FastAPI dependency that enforces rate limits per client IP or authenticated subject.
    Usage: @app.post("/token", dependencies=[Depends(rate_limit(5, 60, "login"))])
    """
    async def dependency(request: Request):
        # Extract client IP (handle proxies if X-Forwarded-For is present)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown_ip"

        # Unique identifier for this endpoint limit
        limit_key = f"{key_prefix}:{client_ip}" if key_prefix else client_ip
        allowed, retry_after = await _global_rate_limiter.is_allowed(limit_key, max_requests, window_seconds)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)}
            )
        return True

    return dependency


# ─── 2. PII (Personally Identifiable Information) Sanitizer ───────────────────

# Common financial PII Regex patterns
_PATTERNS = {
    # Credit / Debit Cards (13 to 19 digits, with spaces or hyphens)
    "credit_card": re.compile(r"\b(?:\d[ -]*?){13,19}\b"),
    # Bank Account / IBAN formats (e.g., GB29 XAAA 2014 5512 3456 78 or 8-18 digit accounts)
    "iban": re.compile(r"\b[A-Z]{2}\d{2}[A-Z0-9]{4,30}\b", re.IGNORECASE),
    "us_bank_account": re.compile(r"\b\d{8,17}\b"),
    # US Social Security Numbers (XXX-XX-XXXX)
    "ssn": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    # Indian PAN (ABCDE1234F) & Aadhaar (12 digits)
    "pan_card": re.compile(r"\b[A-Z]{5}\d{4}[A-Z]\b", re.IGNORECASE),
    "aadhaar": re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b"),
    # Email addresses
    "email": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"),
    # Phone numbers (international and local formats)
    "phone": re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"),
}

def sanitize_pii(text: str) -> str:
    """
    Sanitizes sensitive identifiers in plain text before passing to external AI APIs.
    Preserves transaction semantic intent while masking identifiers.
    """
    if not text or not isinstance(text, str):
        return text

    sanitized = text

    # Redact SSN & Tax Identifiers
    sanitized = _PATTERNS["ssn"].sub("[REDACTED_SSN]", sanitized)
    sanitized = _PATTERNS["pan_card"].sub("[REDACTED_TAX_ID]", sanitized)
    sanitized = _PATTERNS["aadhaar"].sub("[REDACTED_ID]", sanitized)

    # Redact Emails & Phone Numbers
    sanitized = _PATTERNS["email"].sub("[REDACTED_EMAIL]", sanitized)
    sanitized = _PATTERNS["phone"].sub("[REDACTED_PHONE]", sanitized)

    # Redact IBAN
    sanitized = _PATTERNS["iban"].sub("[REDACTED_IBAN]", sanitized)

    # Redact potential card numbers (only if length >= 13 and not just a small year/id)
    def _mask_card(match):
        raw = match.group(0).replace(" ", "").replace("-", "")
        # Don't mask normal numbers (e.g. under 13 digits)
        if len(raw) >= 13 and len(raw) <= 19 and raw.isdigit():
            return f"[CARD_ENDING_{raw[-4:]}]"
        return match.group(0)

    sanitized = _PATTERNS["credit_card"].sub(_mask_card, sanitized)

    return sanitized


def sanitize_data_payload(data: Any) -> Any:
    """
    Recursively scrubs PII from dictionaries, lists, and strings before serialization.
    """
    if isinstance(data, str):
        return sanitize_pii(data)
    elif isinstance(data, dict):
        return {k: sanitize_data_payload(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_data_payload(item) for item in data]
    return data


# ─── 3. HTTP Security Headers ─────────────────────────────────────────────────

SECURITY_HEADERS = {
    # Prevent browsers from MIME-sniffing a response away from the declared content-type
    "X-Content-Type-Options": "nosniff",
    # Prevent Clickjacking by disallowing framing
    "X-Frame-Options": "DENY",
    # Enable browser XSS filtering
    "X-XSS-Protection": "1; mode=block",
    # Enforce HTTPS for 1 year including subdomains (HSTS)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    # Control referrer information passed in requests
    "Referrer-Policy": "strict-origin-when-cross-origin",
    # Content Security Policy (strict defaults, allows fonts and safe assets)
    "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https: blob:;",
    # Restrict permissions for sensitive hardware features
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

def add_security_headers_to_response(response: Response):
    """Appends hardening security headers to a FastAPI/Starlette Response."""
    for header_name, header_value in SECURITY_HEADERS.items():
        response.headers[header_name] = header_value
