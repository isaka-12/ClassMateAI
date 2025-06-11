from fastapi import FastAPI

from app.routers import flashcards

app = FastAPI()
app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"],)
from app.auth import auth_router
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
from app.routers import upload
app.include_router(upload.router, prefix="/upload", tags=["Upload"])

@app.get("/",tags=["Root"])
async def root():
    return {"message": "Welcome to ClassMate AI backend!"}
