# app/routers/flashcards.py

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.services.file_parser import extract_text_from_file
from app.services.cohere_service import generate_flashcards_from_text

router = APIRouter()

@router.post("/generate-flashcards")
async def generate_flashcards(file: UploadFile = File(...)):
    try:
        content = await file.read()

        # Extract text using file_parser
        extracted_text = extract_text_from_file(file.filename, content)
        
        # Debug: Check if text extraction worked
        if not extracted_text or not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")
        
        print(f"Extracted text length: {len(extracted_text)}")
        print(f"First 200 chars: {extracted_text[:200]}")

        # Call Cohere to get flashcards
        try:
            flashcards = generate_flashcards_from_text(extracted_text)
            print(f"Raw flashcards response: {flashcards}")
            print(f"Type of flashcards: {type(flashcards)}")
            print(f"Flashcards truthiness: {bool(flashcards)}")
            if hasattr(flashcards, '__len__'):
                print(f"Flashcards length: {len(flashcards)}")
        except Exception as cohere_error:
            print(f"Error calling Cohere service: {str(cohere_error)}")
            raise HTTPException(status_code=500, detail=f"Cohere service error: {str(cohere_error)}")
        
        # More detailed debugging
        if flashcards is None:
            print("Flashcards is None")
            raise HTTPException(status_code=500, detail="Cohere returned None")
        elif flashcards == "":
            print("Flashcards is empty string")
            raise HTTPException(status_code=500, detail="Cohere returned empty string")
        elif isinstance(flashcards, list) and len(flashcards) == 0:
            print("Flashcards is an empty list")
            raise HTTPException(status_code=500, detail="Cohere returned empty list")
        elif not flashcards:
            print(f"Flashcards is falsy but not None/empty: {repr(flashcards)}")
            raise HTTPException(status_code=500, detail="Cohere returned falsy value")

        return {
            "count": len(flashcards) if isinstance(flashcards, list) else 1,
            "flashcards": flashcards
        }
    
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        print(f"Unexpected error in generate_flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")