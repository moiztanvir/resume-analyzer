from fastapi import FastAPI
from mangum import Mangum
from backend.main import app as fastapi_app

app = fastapi_app
handler = Mangum(app)