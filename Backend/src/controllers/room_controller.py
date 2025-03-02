import random
import string
import requests
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models.room import Room
from utils.ApiResponse import APIResponse  
from utils.ApiError import APIError  
from utils.GenerateEncryptionKey import generate_encryption_key
from middlewares.additonalProtection import AdditionalEncryption

def generate_random_code(length=6):
    chars = string.ascii_letters + string.digits  
    return ''.join(random.choices(chars, k=length))

def get_unique_room_code(db: Session) -> str:
    while True:
        code = generate_random_code()
        if not db.query(Room).filter(Room.code == code).first():
            return code

def get_room_code(db: Session):
    try:
        code = get_unique_room_code(db)

        room_data = {
            "code": code,
            "current_participants": 1,
            "max_participants": 10,
            "time": 60,
            "restrict": False,
            "role": "Host"
        }

        response = requests.post("http://localhost:8000/room/createRoom", json=room_data)

        if response.status_code != 200:
            raise APIError(status_code=response.status_code, detail="Failed to create room.")

        return response.json() 

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

def check_room_code(code: str, db: Session):
    try:
        exists = db.query(Room).filter(Room.code == code).first()
        if exists:
            raise APIError(status_code=409, detail="Room code already exists. Try a different code.")

        return APIResponse.success(message="Room code is available.", data={"room_code": code, "status": "success"})
    
    except APIError as e:
        raise e  

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

def create_room(db: Session, data: dict):
    try:
        if not data:
            raise APIError(status_code=400, detail="No data received.")

        required_fields = ["code", "current_participants", "max_participants", "time", "restrict"]
        for field in required_fields:
            if field not in data:
                raise APIError(status_code=400, detail=f"Missing required field: {field}")

        time_minutes = int(data["time"]) if isinstance(data["time"], (int, str)) and str(data["time"]).isdigit() else 60

        start_time = datetime.now(timezone.utc) 
        end_time = start_time + timedelta(minutes=time_minutes)

        encryption_key = generate_encryption_key()
        encrypted_key = AdditionalEncryption.encrypt_key(encryption_key)

        room = Room(
            code=data["code"],
            start_timing=start_time,
            end_timing=end_time,
            current_participant=data["current_participants"],
            max_participant=data["max_participants"],
            encryption_key=encrypted_key,
            restrict=data["restrict"]
        )

        db.add(room)
        db.commit()
        db.refresh(room)

        return APIResponse.success(message="Room created", data={
            "code": room.code,  
            "time": room.end_timing.strftime("%H:%M:%S"), 
            "restrict": room.restrict,
            "current_participants": room.current_participant,
            "max_participants": room.max_participant,
            "role": "Host"
        })

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")


def join_room(code: str, db: Session):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        if room.current_participant >= room.max_participant:
            raise APIError(status_code=403, detail="Room is full.")

        if room.restrict:
            raise APIError(status_code=403, detail="Room is restricted. Wait for host approval.")

        room.current_participant += 1
        db.commit()
        db.refresh(room)

        return APIResponse.success(
            message="Joined room successfully",
            data={
                "code": room.code,
                "current_participants": room.current_participant,
                "max_participants": room.max_participant,
                "time": room.end_timing.strftime("%H:%M:%S") if room.end_timing else None,
                "restrict": room.restrict,
                "role": "Guest"
            }
        )

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")
