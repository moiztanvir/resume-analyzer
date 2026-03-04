from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from utils import extract_text
from ai_logic import analyze_resume
from db import signup_user, login_user, get_user_data
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="AI Resume Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Resume Analyzer API is running"}

class UserAuth(BaseModel):
    email: str
    password: str

@app.post("/signup")
async def signup(auth: UserAuth):
    res = signup_user(auth.email, auth.password)
    if hasattr(res, 'error') and res.error:
        raise HTTPException(status_code=400, detail=str(res.error))
    return res

@app.post("/login")
async def login(auth: UserAuth):
    res = login_user(auth.email, auth.password)
    if hasattr(res, 'error') and res.error:
        raise HTTPException(status_code=400, detail=str(res.error))
    return res

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form("")
):
    try:
        content = await file.read()
        resume_text = extract_text(content, file.filename)
        analysis_result = analyze_resume(resume_text, job_description)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
