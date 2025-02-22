import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.connection import get_db
from models.room import Room

room_router = APIRouter()

def generate_random_code(length=6):
    """Generate a unique random room code."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@room_router.get("/room")
def generate_room_code(db: Session = Depends(get_db)):
    """Generate a unique room code and return it."""
    while True:
        new_code = generate_random_code()
        existing_room = db.query(Room).filter(Room.code == new_code).first()
        if not existing_room:
            return {"room_code": new_code}

@room_router.post("/room")
def create_or_validate_room(room_code: str = None, db: Session = Depends(get_db)):
    """
    - Agar `room_code` diya gaya hai toh check kare ki exist karta hai ya nahi.
    - Agar nahi diya gaya toh **naya room create kare** aur database me store kare.
    """
    if room_code:
        existing_room = db.query(Room).filter(Room.code == room_code).first()
        if existing_room:
            return {"message": "Room code exists", "status": "success"}
        raise HTTPException(status_code=404, detail="Room code not found")
    
    # **Room code nahi diya toh naya generate karo**
    while True:
        new_code = generate_random_code()
        existing_room = db.query(Room).filter(Room.code == new_code).first()
        if not existing_room:
            #  **Naya room create karke database me save karna**
            new_room = Room(code=new_code, no_of_participant=0, encryption_key="default_key")
            db.add(new_room)
            db.commit()
            return {"message": "Room created", "room_code": new_code}
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.connection import get_db
from models.user import User

user_router = APIRouter()

def generate_random_username():
    """Generate a random username."""
    return f"User{random.randint(100, 999)}"

@user_router.get("/username")
def generate_username(db: Session = Depends(get_db)):
    """Generate a unique username."""
    while True:
        new_username = generate_random_username()
        existing_user = db.query(User).filter(User.username == new_username).first()
        if not existing_user:
            return {"username": new_username}

@user_router.post("/username")
def check_username(username: str, db: Session = Depends(get_db)):
    """Check if a username already exists."""
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        return {"message": "Username exists", "status": "success"}
    raise HTTPException(status_code=404, detail="Username not found")
