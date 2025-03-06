import uuid
import json
from controllers.broadcast_controller import websocket_manager
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.chat import Chat
from models.room import Room
from models.user import User  
from middlewares.additonalProtection import AdditionalEncryption
from middlewares.encryption import EncryptionMiddleware
from middlewares.decryption import DecryptionMiddleware

class ChatResponse(BaseModel):
    success: bool = True
    code: str
    sender: str
    message: str
    timing: str
    chat_id: str

class ErrorResponse(BaseModel):
    error: str

def get_chat(code: str, db: Session):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            return [] 
        
        decrypted_key = AdditionalEncryption.decrypt_key(room.encryption_key)
        chats = db.query(Chat).filter(Chat.code == code).all()

        chat_list = []
        for chat in chats:
            decrypted_chat = DecryptionMiddleware.decrypt(
                {
                    "sender": chat.sender,
                    "message": chat.message,
                    "timing": chat.timing
                },
                decrypted_key
            )

            chat_list.append({
                "code": code,
                "sender": decrypted_chat.get("sender", ""),  
                "message": decrypted_chat.get("message", ""),  
                "timing": decrypted_chat.get("timing", "")
            })

        return chat_list 

    except Exception as e:
        print(f"Error fetching chat: {e}") 
        return []  

async def add_chat(chat_data: dict, db: Session):
    try:
        room = db.query(Room).filter(Room.code == chat_data["code"]).first()
        if not room:
            return {"error": "Invalid room code"}

        user = db.query(User).filter(
            User.code == chat_data["code"],
            User.username.ilike(chat_data["sender"])  
        ).first()

        if not user:
            return {"error": "Sender not found in the room"}

        decrypted_key = AdditionalEncryption.decrypt_key(room.encryption_key)

        encrypted_chat_data = EncryptionMiddleware.encrypt(
            {
                "sender": chat_data["sender"],
                "message": chat_data["message"],
                "timing": chat_data["timing"]
            },
            decrypted_key
        )

        new_chat = Chat(
            chat_id=str(uuid.uuid4()),
            code=chat_data["code"],
            sender=encrypted_chat_data["sender"],
            message=encrypted_chat_data["message"],
            timing=encrypted_chat_data["timing"]
        )

        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)

        chat_message = {
            "room": new_chat.code,  
            "type": "chat",  
            "data": {  
                "sender": chat_data["sender"],  
                "message": chat_data["message"], 
                "timing": chat_data["timing"] 
            }
        }
        
        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(new_chat.code, json.dumps(chat_message))

        return ChatResponse(
            code=new_chat.code,
            sender=new_chat.sender,
            message=new_chat.message,
            timing=new_chat.timing
        )

    except Exception as e:
        db.rollback()
        return {"error": f"An error occurred: {str(e)}"}
