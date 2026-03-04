# AI Resume Analyzer Execution Guide

This guide will walk you through setting up and running the AI Resume Analyzer project.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd "resume-analyzer/backend"
    ```
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend` folder and add your credentials:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    SUPABASE_URL=your_supabase_url_here
    SUPABASE_KEY=your_supabase_anon_key_here
    ```
5.  **Supabase Setup**:
    - Go to [Supabase](https://supabase.com/).
    - Create a new project.
    - Go to **Project Settings -> API** to find your URL and Anon Key.
    - Enable **Email Auth** in Authentication settings.
6.  Start the FastAPI server:
    ```bash
    python main.py
    ```
    The backend will be running at `http://localhost:8000`.

## 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd "resume-analyzer/frontend"
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

## 3. How to Use

1.  Open your browser and go to `http://localhost:5173`.
2.  Upload your resume (PDF or DOCX).
3.  (Optional) Paste a job description to see how well you match.
4.  Click **"Analyze Now"** and wait for the AI to process your resume.
5.  Review your ATS score, extracted skills, and improvement suggestions!
