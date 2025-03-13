from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from db.connection import get_db
from controllers.file_controller import validate_file  

file_router = APIRouter()

@file_router.post("/uploadFile")
async def upload_file_route(
    db: Session = Depends(get_db),
    room_code: str = Form(...), 
    user_id: str = Form(...), 
    username: str = Form(...), 
    file: UploadFile = File()
):
    return await validate_file(db, room_code, username, user_id, file)
