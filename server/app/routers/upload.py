from fastapi import APIRouter, UploadFile
from app.services.file_parser import extract_text_from_file

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/parse")
async def parse_file(file: UploadFile):
    content = await file.read()
    text = extract_text_from_file(file.filename, content)
    return {"text": text[:2000]}  # Limit return for preview