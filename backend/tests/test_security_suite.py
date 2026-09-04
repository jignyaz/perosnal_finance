"""
Test Suite: Enterprise Security & Privacy
Tests sliding-window rate limiting, PII sanitizer, per-user salt encryption, and security headers.
"""

import asyncio
from security import (
    SlidingWindowRateLimiter,
    sanitize_pii,
    sanitize_data_payload,
    SECURITY_HEADERS,
    add_security_headers_to_response
)
from crypto import encrypt_value, decrypt_value, mask_api_key
from fastapi import Response


async def test_rate_limiter_sliding_window():
    """Verify rate limiter allows requests within limit and rejects excess requests."""
    limiter = SlidingWindowRateLimiter()
    key = "client_test_ip_1"
    max_req = 4
    window = 10

    # 4 requests within limit should all succeed
    for i in range(max_req):
        allowed, retry_after = await limiter.is_allowed(key, max_req, window)
        assert allowed is True
        assert retry_after == 0

    # 5th request must be denied
    allowed, retry_after = await limiter.is_allowed(key, max_req, window)
    assert allowed is False
    assert retry_after > 0
    assert retry_after <= window


def test_pii_sanitizer_financial_data():
    """Verify credit card numbers, SSNs, PANs, and IBANs are masked."""
    # Test card masking
    text_card = "Payment processed on Visa card 4532-1188-9900-3456 for groceries."
    sanitized_card = sanitize_pii(text_card)
    assert "[CARD_ENDING_3456]" in sanitized_card
    assert "4532-1188-9900-3456" not in sanitized_card

    # Test SSN masking
    text_ssn = "Customer SSN is 000-12-3456 for loan verification."
    sanitized_ssn = sanitize_pii(text_ssn)
    assert "[REDACTED_SSN]" in sanitized_ssn
    assert "000-12-3456" not in sanitized_ssn

    # Test Indian PAN card
    text_pan = "Tax identifier ABCDE1234F provided for billing."
    sanitized_pan = sanitize_pii(text_pan)
    assert "[REDACTED_TAX_ID]" in sanitized_pan
    assert "ABCDE1234F" not in sanitized_pan


def test_pii_sanitizer_contact_details():
    """Verify email addresses and phone numbers are redacted."""
    text_contact = "Please contact support at finance.user@example.com or call +1 (555) 234-5678."
    sanitized = sanitize_pii(text_contact)

    assert "[REDACTED_EMAIL]" in sanitized
    assert "finance.user@example.com" not in sanitized
    assert "[REDACTED_PHONE]" in sanitized
    assert "234-5678" not in sanitized


def test_pii_sanitizer_structured_payload():
    """Verify recursive data payload scrubbing on nested dicts and lists."""
    payload = {
        "user": "alex_doe",
        "email": "alex@company.org",
        "transactions": [
            {"note": "Card 4111-2222-3333-7890 payment", "amount": 1500.0},
            {"note": "Refund to customer phone +1-800-555-0199", "amount": 250.0}
        ]
    }
    cleaned = sanitize_data_payload(payload)

    assert cleaned["email"] == "[REDACTED_EMAIL]"
    assert "[CARD_ENDING_7890]" in cleaned["transactions"][0]["note"]
    assert "[REDACTED_PHONE]" in cleaned["transactions"][1]["note"]


def test_crypto_per_user_salt_isolation():
    """Verify encrypting with different user salts yields distinct ciphertexts and proper roundtrip."""
    api_key = "AIzaSySecretApiKeyForUser12345"
    salt_a = "user_alpha"
    salt_b = "user_beta"

    ciphertext_a = encrypt_value(api_key, user_salt=salt_a)
    ciphertext_b = encrypt_value(api_key, user_salt=salt_b)

    # Different salts must generate completely different ciphertexts
    assert ciphertext_a != ciphertext_b

    # Decrypting with matching salt succeeds
    assert decrypt_value(ciphertext_a, user_salt=salt_a) == api_key
    assert decrypt_value(ciphertext_b, user_salt=salt_b) == api_key

    # Masking test
    masked = mask_api_key(api_key)
    assert masked.startswith("AIza")
    assert masked.endswith("2345")
    assert "..." in masked
    assert "SecretApiKeyForUser" not in masked


def test_security_headers_injection():
    """Verify required HTTP security headers are injected on responses."""
    response = Response()
    add_security_headers_to_response(response)

    headers = response.headers
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert "max-age=31536000" in headers.get("Strict-Transport-Security", "")
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "default-src 'self'" in headers.get("Content-Security-Policy", "")
