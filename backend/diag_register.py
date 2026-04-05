import requests
import json

url = "http://localhost:8000/register"
payload = {
    "username": "testuser_diag",
    "password_hash": "testpassword",
    "full_name": "Test User",
    "phone_number": "1234567890",
    "dob": "1990-01-01T00:00:00"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
