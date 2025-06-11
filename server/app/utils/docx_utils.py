from docx import Document
import io

def extract_text_from_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join([p.text for p in doc.paragraphs])