# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import flashcards
from app.auth import auth_router
from app.routers import upload

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://classmateai-tz.netlify.app"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to ClassMate AI backend!"}