from fastapi import APIRouter, Depends, HTTPException
from app.auth.models import UserIn, Token
from app.auth.auth_service import hash_password, verify_password, create_access_token
from app.db import get_user_collection

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserIn, users = Depends(get_user_collection)):
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    users.insert_one({"email": user.email, "password": hash_password(user.password)})
    return {"msg": "User created"}

@router.post("/login", response_model=Token)
def login(user: UserIn, users = Depends(get_user_collection)):
    db_user = users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}
