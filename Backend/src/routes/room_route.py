import random
import string
import requests  
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from models.room import Room
from utils.ApiResponse import APIResponse  
from utils.ApiError import APIError  
from pydantic import BaseModel

room_router = APIRouter()

class RoomCodeRequest(BaseModel):
    room_code: str  

def generate_random_code(length=6):
    chars = string.ascii_letters + string.digits  
    return ''.join(random.choices(chars, k=length))

def get_unique_room_code(db: Session) -> str:
    while True:
        code = generate_random_code()
        if not db.query(Room).filter(Room.code == code).first():
            return code

@room_router.get("/getCode")
def get_room_code(db: Session = Depends(get_db)):
    try:
        code = get_unique_room_code(db)

        room_data = {
            "room_code": code,
            "participants": 10,
            "time": 60,
            "restrict_mode": False
        }

        response = requests.post("http://localhost:8000/room/createRoom", json=room_data)  

        if response.status_code != 200:
            raise APIError(status_code=response.status_code, detail="Failed to create room.")

        return APIResponse.success(message="Room code generated", data=room_data)
    
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

@room_router.post("/verifyCode")
def check_room_code(request: RoomCodeRequest, db: Session = Depends(get_db)):
    try:
        exists = db.query(Room).filter(Room.code == request.room_code).first()
        if exists:
            raise APIError(status_code=409, detail="Room code already exists. Try a different code.")

        return APIResponse.success(message="Room code is available.", data={"room_code": request.room_code, "status": "success"})
    
    except APIError as e:
        raise e  

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

@room_router.post("/createRoom")
def create_room(data: dict):
    try:
        if not data:
            raise APIError(status_code=400, detail="No data received.")

        required_fields = ["room_code", "participants", "time", "restrict_mode"]
        for field in required_fields:
            if field not in data:
                raise APIError(status_code=400, detail=f"Missing required field: {field}")

        print("Received Data:", data)
        return APIResponse.success(message="Room data received and stored.", data=data)

    except APIError as e:
        raise e  

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")
