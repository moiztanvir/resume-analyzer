from fastapi import FastAPI
from mangum import Mangum
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from backend.main import app
# from backend.main import app as fastapi_app

app = fastapi_app
handler = Mangum(app)
