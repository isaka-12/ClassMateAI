# app/routers/flashcards.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.gemini_service import generate_flashcards_from_file, get_additional_explanation

router = APIRouter()

@router.post("/generate-flashcards")
async def generate_flashcards(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # Use async version of generate_flashcards_from_file
        flashcards = await generate_flashcards_from_file(content, file.filename)
        
        if not flashcards:
            raise HTTPException(status_code=500, detail="Failed to generate flashcards")

        return {
            "count": len(flashcards),
            "flashcards": flashcards,
            "model_used": "gemini-1.5-flash",
            "file_type": file.filename.split('.')[-1] if '.' in file.filename else "unknown"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in generate_flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/explain-more")
async def get_more_explanation(request: dict):
    """Get additional explanation for a flashcard"""
    question = request.get("question", "")
    answer = request.get("answer", "")
    context = request.get("context", "")
    
    if not question or not answer:
        raise HTTPException(status_code=400, detail="Question and answer are required")
    
    try:
        explanation = await get_additional_explanation(question, answer, context)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")