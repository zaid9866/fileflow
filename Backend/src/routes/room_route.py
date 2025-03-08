from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from pydantic import BaseModel
import controllers.room_controller as room_controller

room_router = APIRouter()

class RoomCodeRequest(BaseModel):
    code: str

class RestrictRoomRequest(BaseModel):
    code: str
    username: str

class HostResponse(BaseModel):
    code: str
    username: str
    hostName: str
    userId: str

class LeaveRoomRequest(BaseModel):
    code: str
    username: str
    userId: str
    role: str

class ChangeParticipantRequest(BaseModel):
    code: str
    username: str
    user_id: str
    new_max_participant: int

class ChangeTimeRequest(BaseModel):
    code: str
    username: str
    user_id: str
    new_time: str

@room_router.get("/getCode")
def get_room_code(db: Session = Depends(get_db)):
    return room_controller.get_room_code(db)

@room_router.post("/verifyCode")
def check_room_code(request: RoomCodeRequest, db: Session = Depends(get_db)):
    return room_controller.check_room_code(request.code, db)

@room_router.post("/createRoom")
def create_room(data: dict, db: Session = Depends(get_db)):
    return room_controller.create_room(db, data)

@room_router.post("/joinRoom")
def join_room(request: RoomCodeRequest, db: Session = Depends(get_db)):
    return room_controller.join_room(request.code, db)

@room_router.post("/restricted")
async def join_restrict_room(request: RestrictRoomRequest, db: Session = Depends(get_db)):
    return await room_controller.join_restrict_room(request.code, db, request.username)

@room_router.post("/approveUser")
async def approve_user_route(request: HostResponse, db: Session = Depends(get_db)):
    return await room_controller.approve_user(
        request.code, 
        db, 
        request.username, 
        request.hostName,  
        request.userId   
    )

@room_router.post("/rejectUser")
async def reject_user_route(request: HostResponse, db: Session = Depends(get_db)):
    return await room_controller.reject_user(
        request.code, 
        db, 
        request.username, 
        request.hostName,
        request.userId   
    )

@room_router.post("/leaveRoom")
async def leave_room_route(request: LeaveRoomRequest, db: Session = Depends(get_db)):
    return await room_controller.leave_room(request, db)

@room_router.post("/changeNoOfParticipant")
async def change_no_of_participant(request: ChangeParticipantRequest, db: Session = Depends(get_db)):
    return await room_controller.update_room_participants(
        request.code,
        db,
        request.username,
        request.user_id,
        request.new_max_participant
    )

@room_router.post("/changeRoomTime")
async def change_room_time(request: ChangeTimeRequest, db: Session = Depends(get_db)):
    return await room_controller.update_room_time(
        request.code,
        db,
        request.username,
        request.user_id,
        request.new_time
    )
