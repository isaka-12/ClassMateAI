from pymongo import MongoClient
from fastapi import Depends

client = MongoClient("mongodb+srv://isakamtweve69:BNZK3uNmGEOZbW6E@cluster0.brqdvmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["classmate_ai"]

def get_user_collection():
    return db["users"]
