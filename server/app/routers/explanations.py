from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.cohere_service import (
    get_additional_explanation,
    get_simplified_explanation,
    get_examples_and_applications
)

router = APIRouter()

class ExplanationRequest(BaseModel):
    question: str
    current_answer: str
    context: str = ""

class SimplifiedRequest(BaseModel):
    question: str
    current_answer: str

class ExamplesRequest(BaseModel):
    question: str
    current_answer: str

@router.post("/additional-explanation")
async def get_more_explanation(request: ExplanationRequest):
    """Get additional detailed explanation for a flashcard"""
    try:
        result = get_additional_explanation(
            question=request.question,
            current_answer=request.current_answer,
            context=request.context
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate explanation"))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

@router.post("/simplified-explanation")
async def get_simple_explanation(request: SimplifiedRequest):
    """Get simplified explanation for complex concepts"""
    try:
        result = get_simplified_explanation(
            question=request.question,
            current_answer=request.current_answer
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate simplified explanation"))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating simplified explanation: {str(e)}")

@router.post("/examples")
async def get_practical_examples(request: ExamplesRequest):
    """Get practical examples and real-world applications"""
    try:
        result = get_examples_and_applications(
            question=request.question,
            current_answer=request.current_answer
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate examples"))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating examples: {str(e)}")