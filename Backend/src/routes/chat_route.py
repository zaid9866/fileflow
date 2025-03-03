from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from controllers.chat_controller import get_chat,add_chat
from pydantic import BaseModel
from typing import List, Union

chat_router = APIRouter()

class ChatRequest(BaseModel):
    code: str
    sender: str
    message: str
    timing: str  

    class Config:
        from_attributes = True  

class ChatResponse(BaseModel):
    success: bool
    chat_id: str
    code: str
    sender: str
    message: str
    timing: str

class ErrorResponse(BaseModel):
    error: str

@chat_router.get("/getChat", response_model=List[ChatRequest])
def get_chat_route(code: str, db: Session = Depends(get_db)):
    return get_chat(code, db)

@chat_router.post("/addChat", response_model=Union[ChatResponse, ErrorResponse])
async def add_chat_route(request: ChatRequest, db: Session = Depends(get_db)):
    return await add_chat(request.dict(), db) 
