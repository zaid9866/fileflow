from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from db.connection import get_db
from pydantic import BaseModel
from controllers.file_controller import validate_file, get_file, delete_file

file_router = APIRouter()

class FileRequest(BaseModel):
    room_code: str
    username: str
    user_id: str

class DeleteRequest(BaseModel):
    room_code: str
    username: str
    user_id: str
    file_name: str

@file_router.post("/uploadFile")
async def upload_file_route(
    db: Session = Depends(get_db),
    room_code: str = Form(...), 
    user_id: str = Form(...), 
    username: str = Form(...), 
    file: UploadFile = File()
):
    return await validate_file(db, room_code, username, user_id, file)

@file_router.post("/getFile")
async def get_file_route(request: FileRequest, db: Session = Depends(get_db)):
    return await get_file(db, request.room_code, request.username, request.user_id)
    
@file_router.post("/deleteFile")
async def delete_file_route(request: DeleteRequest, db: Session = Depends(get_db)):
    return await delete_file(db, request.room_code, request.user_id, request.username, request.file_name)
