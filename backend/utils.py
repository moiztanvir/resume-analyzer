import pdfplumber
import docx
import io

def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_content: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_content))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def extract_text(file_content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_content)
    elif filename.lower().endswith(".docx"):
        return extract_text_from_docx(file_content)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")
