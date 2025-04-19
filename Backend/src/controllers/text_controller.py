import json
from sqlalchemy.orm import Session
from models.text import TextModel
from models.room import Room
from models.user import User
from utils.ApiError import APIError
from utils.ApiResponse import APIResponse
from middlewares.additonalProtection import AdditionalEncryption
from middlewares.encryption import EncryptionMiddleware
from middlewares.decryption import DecryptionMiddleware
from controllers.broadcast_controller import websocket_manager

async def add_text(
    db: Session,
    room_code: str,
    username: str,
    user_id: str,
    text_id: str,
    text_content: str
):
    try:
        room = db.query(Room).filter(Room.code == room_code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.code == room_code
        ).first()
        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

        encrypted_data = EncryptionMiddleware.encrypt({
            "username": username,
            "text_content": text_content
        }, encryption_key)

        existing_text = db.query(TextModel).filter(
            TextModel.textId == text_id,
            TextModel.code == room_code
        ).first()

        if existing_text:
            db.delete(existing_text)
            db.commit()

        new_text = TextModel(
            textId=text_id,
            code=room_code,
            content=encrypted_data["text_content"],
            shared_by=encrypted_data["username"]
        )
        db.add(new_text)
        db.commit()

        response = {
            "room": room_code,
            "type": "text",
            "data": {
                "text_id": text_id,
                "username": username,
                "text_content": text_content
            }
        }

        try:
            if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                await websocket_manager.broadcast(room_code, json.dumps(response))
        except Exception:
            pass

        return APIResponse.success(message="Text updated successfully." if existing_text else "Text stored successfully.")

    except APIError as e:
        db.rollback()
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        db.rollback()
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")

async def increase_text_field(
    db: Session,
    room_code: str,
    username: str,
    user_id: str,
    text_id: str,
):
    try:
        room = db.query(Room).filter(Room.code == room_code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.code == room_code
        ).first()
        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        if room.textField >= 5:
            return APIResponse.error(status_code=400, message="Text field limit reached (max 5).")

        room.textField += 1
        db.commit()

        response = {
            "room": room_code,
            "type": "increaseField",
            "data": {
                "text_id": text_id,
                "username": username,
            }
        }

        try:
            if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                await websocket_manager.broadcast(room_code, json.dumps(response))
        except Exception:
            pass

        return APIResponse.success(message="Text field increased and broadcasted successfully.")

    except APIError as e:
        db.rollback()
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        db.rollback()
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")

async def decrease_text_field(
    db: Session,
    room_code: str,
    username: str,
    user_id: str,
    text_id: str,
):
    try:
        room = db.query(Room).filter(Room.code == room_code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.code == room_code
        ).first()
        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        text_entry = db.query(TextModel).filter(
            TextModel.textId == text_id,
            TextModel.code == room_code
        ).first()

        if text_entry:
            db.delete(text_entry)
            db.commit()

        if room.textField > 0:
            room.textField -= 1
            db.commit()

        response = {
            "room": room_code,
            "type": "decreaseField",
            "data": {
                "text_id": text_id,
                "username": username,
            }
        }

        try:
            if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                await websocket_manager.broadcast(room_code, json.dumps(response))
        except Exception:
            pass

        return APIResponse.success(message="Text field decreased and removed from DB if it existed.")

    except APIError as e:
        db.rollback()
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        db.rollback()
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")

async def remove_text(
    db: Session,
    room_code: str,
    username: str,
    user_id: str,
    text_id: str,
):
    try:
        room = db.query(Room).filter(Room.code == room_code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.code == room_code
        ).first()
        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        text_entry = db.query(TextModel).filter(
            TextModel.textId == text_id,
            TextModel.code == room_code
        ).first()

        if text_entry:
            db.delete(text_entry)
            db.commit()

        response = {
            "room": room_code,
            "type": "removeText",
            "data": {
                "text_id": text_id,
                "username": username,
            }
        }

        try:
            if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                await websocket_manager.broadcast(room_code, json.dumps(response))
        except Exception:
            pass

        return APIResponse.success(message="Text removed from DB.")

    except APIError as e:
        db.rollback()
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        db.rollback()
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")

async def fetch_all_texts(
    db: Session,
    room_code: str,
    username: str,
    user_id: str
):
    try:
        room = db.query(Room).filter(Room.code == room_code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.code == room_code
        ).first()
        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

        texts = db.query(TextModel).filter(TextModel.code == room_code).all()

        text_list = []
        for text in texts:
            decrypted_data = DecryptionMiddleware.decrypt({
                "username": text.shared_by,
                "text_content": text.content
            }, encryption_key)

            text_list.append({
                "text_id": text.textId,
                "username": decrypted_data["username"],
                "text_content": decrypted_data["text_content"]
            })

        response_data = {
            "textField": room.textField,  
            "texts": text_list             
        }

        return APIResponse.success(data=response_data, message="All texts fetched successfully.")

    except APIError as e:
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")
