from pymongo import MongoClient
from fastapi import Depends
import os

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Get MongoDB URI from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)
db = client["classmate_ai"]

def get_user_collection():
    return db["users"]