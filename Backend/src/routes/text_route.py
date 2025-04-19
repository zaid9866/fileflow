from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from controllers.text_controller import add_text, increase_text_field, decrease_text_field, remove_text, fetch_all_texts
from pydantic import BaseModel

text_router = APIRouter()

class AddTextRequest(BaseModel):
    room_code: str
    user_id: str
    username: str
    text_id: str
    text_content: str

class TextFieldActionRequest(BaseModel):
    room_code: str
    user_id: str
    username: str
    text_id: str

class GetText(BaseModel):
    room_code: str
    user_id: str
    username: str

@text_router.post("/addText")
async def add_text_route(request: AddTextRequest, db: Session = Depends(get_db)):
    return await add_text(db, request.room_code, request.username, request.user_id, request.text_id, request.text_content)

@text_router.post("/increaseField")
async def increase_text_field_route(request: TextFieldActionRequest, db: Session = Depends(get_db)):
    return await increase_text_field(db, request.room_code, request.username, request.user_id, request.text_id)

@text_router.post("/decreaseField")
async def decrease_text_field_route(request: TextFieldActionRequest, db: Session = Depends(get_db)):
    return await decrease_text_field(db, request.room_code, request.username, request.user_id, request.text_id)

@text_router.post("/removeText")
async def remove_text_route(request: TextFieldActionRequest, db: Session = Depends(get_db)):
    return await remove_text(db, request.room_code, request.username, request.user_id, request.text_id)

@text_router.post("/getText")
async def fetch_text_route(request: GetText, db: Session = Depends(get_db)):
    return await fetch_all_texts(db, request.room_code, request.username, request.user_id)
