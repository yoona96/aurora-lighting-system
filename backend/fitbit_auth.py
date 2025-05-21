import os
import requests
from urllib.parse import urlencode
from base64 import b64encode

CLIENT_ID = os.getenv("FITBIT_CLIENT_ID")
CLIENT_SECRET = os.getenv("FITBIT_CLIENT_SECRET")
REDIRECT_URI = os.getenv("FITBIT_REDIRECT_URI", "https://aurora-lighting-system.onrender.com/callback")

SCOPES = ["heartrate", "oxygen_saturation", "activity"]

def get_authorize_url():
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "redirect_uri": REDIRECT_URI
    }
    return "https://www.fitbit.com/oauth2/authorize?" + urlencode(params)

def get_token(code):
    headers = {
        "Authorization": "Basic " + b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode(),
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "code": code
    }
    res = requests.post("https://api.fitbit.com/oauth2/token", headers=headers, data=data)
    return res.json()
