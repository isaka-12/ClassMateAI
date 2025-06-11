# app/services/file_parser.py

from app.utils.pdf_utils import extract_text_from_pdf
from app.utils.docx_utils import extract_text_from_docx
from app.utils.pptx_utils import extract_text_from_pptx

def extract_text_from_file(filename: str, content: bytes) -> str:
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(content)
    elif filename.endswith(".pptx"):
        return extract_text_from_pptx(content)
    else:
        return content.decode("utf-8")
