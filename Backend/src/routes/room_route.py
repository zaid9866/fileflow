from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from pydantic import BaseModel
import controllers.room_controller as room_controller  

room_router = APIRouter()

class RoomCodeRequest(BaseModel):
    code: str

@room_router.get("/getCode")
def get_room_code(db: Session = Depends(get_db)):
    return room_controller.get_room_code(db)

@room_router.post("/verifyCode")
def check_room_code(request: RoomCodeRequest, db: Session = Depends(get_db)):
    return room_controller.check_room_code(request.code, db)

@room_router.post("/createRoom")
def create_room(data: dict, db: Session = Depends(get_db)):
    return room_controller.create_room(db, data)