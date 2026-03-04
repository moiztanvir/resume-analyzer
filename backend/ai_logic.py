from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
import os

class ResumeAnalysis(BaseModel):
    skills: List[str] = Field(description="List of detected skills")
    ats_score: int = Field(description="ATS score from 0 to 100")
    match_percentage: int = Field(description="Match percentage against job description")
    improvements: List[str] = Field(description="List of suggestions for improvement")
    summary: str = Field(description="Brief summary of the resume")

def analyze_resume(resume_text: str, job_description: str = "") -> ResumeAnalysis:
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
    
    parser = PydanticOutputParser(pydantic_object=ResumeAnalysis)
    
    template = """
    You are an expert ATS (Applicant Tracking System) and Career Coach. 
    Analyze the following resume text and compare it with the job description (if provided).
    
    Resume Text:
    {resume_text}
    
    Job Description:
    {job_description}
    
    {format_instructions}
    """
    
    prompt = PromptTemplate(
        template=template,
        input_variables=["resume_text", "job_description"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "resume_text": resume_text,
        "job_description": job_description
    })
    
    return result
