from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def signup_user(email, password):
    if not supabase:
        return {"error": "Supabase credentials not configured"}
    return supabase.auth.sign_up({"email": email, "password": password})

def login_user(email, password):
    if not supabase:
        return {"error": "Supabase credentials not configured"}
    return supabase.auth.sign_in_with_password({"email": email, "password": password})

def get_user_data(token):
    if not supabase:
        return {"error": "Supabase credentials not configured"}
    return supabase.auth.get_user(token)
