import random
import string
import requests
import json
import asyncio
pending_requests = {}  
from fastapi import Request
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models.room import Room
from models.user import User
from models.chat import Chat
from models.file import File
from models.text import TextModel
from utils.ApiResponse import APIResponse  
from utils.ApiError import APIError  
from utils.GenerateEncryptionKey import generate_encryption_key
from middlewares.additonalProtection import AdditionalEncryption
from middlewares.encryption import EncryptionMiddleware
from middlewares.decryption import DecryptionMiddleware
from controllers.broadcast_controller import websocket_manager
from utils.cloudinary import delete_file as delete_file_from_cloudinary
from utils.serviceDrive import delete_file_from_drive

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
        })

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

def join_room(code: str, db: Session, request: Request):
    try:
        client_ip = request.client.host  
        room = db.query(Room).filter(Room.code == code).first()
        
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

        blocked_ips = json.loads(room.blocked) if room.blocked else []

        decrypted_blocked_ips = [
            DecryptionMiddleware.decrypt(ip, encryption_key)["ip_address"]
            for ip in blocked_ips
        ]

        if client_ip in decrypted_blocked_ips:
            raise APIError(status_code=403, detail="You are blocked from this room.")

        if room.current_participant >= room.max_participant:
            raise APIError(status_code=403, detail="Room is full.")

        if room.restrict:
            return APIResponse.success(
                message="Room is Restricted, wait for Host Approval",
                data={"code": room.code}
            )

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
            }
        )

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

async def leave_room(request, db: Session):
    try:
        if not request.code.strip():
            raise APIError(status_code=400, detail="Room code is required.")
        if not request.username.strip():
            raise APIError(status_code=400, detail="Username is required.")
        if not request.userId.strip():
            raise APIError(status_code=400, detail="User ID is required.")

        existing_user = db.query(User).filter(
            User.username == request.username,
            User.user_id == request.userId,
            User.code == request.code
        ).first()

        if not existing_user:
            raise APIError(status_code=404, detail="User not found in this room.")

        room = db.query(Room).filter(Room.code == request.code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        if request.role == "Host":
            files = db.query(File).filter(File.code == request.code).all()
            encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

            for f in files:
                try:
                    decrypted_content = DecryptionMiddleware.decrypt({
                        "file_id": f.content_id
                    }, encryption_key)
                    decrypted_file_id = decrypted_content.get("file_id")

                    if decrypted_file_id:
                        try:
                            delete_file_from_cloudinary(decrypted_file_id)
                            delete_file_from_drive(decrypted_file_id)
                        except Exception:
                            pass  
                except Exception as e:
                    print(f"Failed to decrypt file_id for file {f.id}: {e}")
                    continue

            db.query(Chat).filter(Chat.code == request.code).delete()
            db.query(File).filter(File.code == request.code).delete()
            db.query(User).filter(User.code == request.code).delete()
            db.query(TextModel).filter(TextModel.code == request.code).delete()
            db.query(Room).filter(Room.code == request.code).delete()
            db.commit()

            response = {
                "room": request.code,
                "type": "roomClosed",
                "data": {
                    "message": f"Host {request.username} has left. Room closed."
                }
            }
        else:
            if room.current_participant > 0:
                room.current_participant -= 1
            db.delete(existing_user)
            db.commit()

            response = {
                "room": request.code,
                "type": "userLeft",
                "data": {
                    "username": request.username,
                    "current_participants": room.current_participant,
                    "message": f"{request.username} has left the room."
                }
            }

        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(request.code, json.dumps(response))

        return APIResponse.success(
            message="User left successfully.",
            data={
                "username": request.username,
                "current_participants": room.current_participant if request.role != "Host" else 0
            }
        )

    except APIError as e:
        raise e
    except Exception as e:
        print("Unexpected Error:", str(e))
        db.rollback()
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

async def join_restrict_room(code: str, db: Session, username: str, request: Request):
    try:
        client_ip = request.client.host  
        room = db.query(Room).filter(Room.code == code).first()

        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

        blocked_ips = json.loads(room.blocked) if room.blocked else []

        decrypted_blocked_ips = [
            DecryptionMiddleware.decrypt(ip, encryption_key)["ip_address"]
            for ip in blocked_ips
        ]

        if client_ip in decrypted_blocked_ips:
            raise APIError(status_code=403, detail="You are blocked from this room.")

        if room.current_participant >= room.max_participant:
            raise APIError(status_code=403, detail="Room is full.")

        if room.restrict:
            response = {
                "room": code,
                "type": "joinRequest",
                "data": {
                    "username": username
                }
            }

            if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                await websocket_manager.broadcast(code, json.dumps(response))

            if code not in pending_requests:
                pending_requests[code] = []
            pending_requests[code].append(username)

            try:
                await asyncio.wait_for(wait_for_host_approval(code, username), timeout=120)
            except asyncio.TimeoutError:
                pending_requests[code].remove(username)
                raise APIError(status_code=403, detail="Host did not approve.")

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
            }
        )

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

async def wait_for_host_approval(code: str, username: str):
    while username in pending_requests.get(code, []):
        await asyncio.sleep(2)  

async def approve_user(code: str, db: Session, username: str, hostName: str, userId: int):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        user = db.query(User).filter(User.username == hostName, User.user_id == userId).first()
        if not user or user.role != "Host": 
            raise APIError(status_code=403, detail="User is not authorized as Host.")

        if user.username != hostName or user.user_id != userId:
            raise APIError(status_code=403, detail="Host details mismatch.")

        if username not in pending_requests.get(code, []):
            raise APIError(status_code=404, detail="User not found in waiting list.")

        if room.current_participant >= room.max_participant:
            response = {
                "room": code,
                "type": "roomFull",
                "data": {
                    "username": username,
                    "status": "room is full"
                }
            }
            if hasattr(websocket_manager, "send_to_user") and callable(websocket_manager.send_to_user):
                await websocket_manager.send_to_user(username, json.dumps(response))

            return APIResponse.success(message="Room is full. Cannot approve user.")

        pending_requests[code].remove(username)
        room.current_participant += 1
        db.commit()  
        db.refresh(room)

        response = {
            "room": code,
            "type": "approveUser",
            "data": {
                "username": username,
                "status": "approved"
            }
        }
        if hasattr(websocket_manager, "send_to_user") and callable(websocket_manager.send_to_user):
            await websocket_manager.send_to_user(username, json.dumps(response))

        return APIResponse.success(message="User approved successfully.")

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error.")

async def reject_user(code: str, db: Session, username: str, hostName: str, userId: int):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        user = db.query(User).filter(User.username == hostName, User.user_id == userId).first()
        if not user or user.role != "Host": 
            raise APIError(status_code=403, detail="User is not authorized as Host.")

        if user.username != hostName or user.user_id != userId:
            raise APIError(status_code=403, detail="Host details mismatch.")

        if username not in pending_requests.get(code, []):
            raise APIError(status_code=404, detail="User not found in waiting list.")

        pending_requests[code].remove(username)

        response = {
            "room": code,
            "type": "rejectUser",
            "data": {
                "username": username,
                "message": "Your invite was rejected by the host"
            }
        }
        if hasattr(websocket_manager, "send_to_user") and callable(websocket_manager.send_to_user):
            await websocket_manager.send_to_user(username, json.dumps(response))

        return APIResponse.success(message="User rejected successfully.")

    except APIError as e:
        raise e

    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error.")

async def update_room_participants(code: str, db: Session, username: str, user_id: int, new_max_participant: int):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise APIError(status_code=404, detail="User not found.")

        if user.user_id != user_id:
            raise APIError(status_code=403, detail="User ID mismatch.")

        if user.role != "Host":
            raise APIError(status_code=403, detail="User is not authorized as Host.")

        old_max_participant = room.max_participant
        room.max_participant = new_max_participant
        db.commit()
        db.refresh(room)

        response = {
            "room": code,
            "type": "changeNoOfUsers",
            "data": {
                "old_max_participants": old_max_participant,
                "max_participants": room.max_participant
            }
        }

        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(code, json.dumps(response))

        return APIResponse.success(message="Room participants updated successfully.")
    except APIError as e:
        raise e
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error.")

async def update_room_time(code: str, db: Session, username: str, user_id: str, new_time: str):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise APIError(status_code=404, detail="User not found.")

        if user.user_id != user_id:
            raise APIError(status_code=403, detail="User ID mismatch.")

        if user.role != "Host":
            raise APIError(status_code=403, detail="User is not authorized as Host.")

        current_time = datetime.now().time()

        try:
            time_parts = list(map(int, new_time.split(":")))
            if len(time_parts) != 3:
                raise ValueError("Invalid time format")
            added_time = timedelta(hours=time_parts[0], minutes=time_parts[1], seconds=time_parts[2])
        except ValueError:
            raise APIError(status_code=400, detail="Invalid time format. Use HH:MM:SS.")

        current_datetime = datetime.combine(datetime.now().date(), current_time)
        new_end_time = (current_datetime + added_time).time()

        room.end_timing = new_end_time
        db.commit()
        db.refresh(room)

        response = {
            "room": code,
            "type": "changeEndTime",
            "data": {
                "end_time": new_end_time.strftime("%H:%M:%S")
            }
        }

        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(code, json.dumps(response))

        return APIResponse.success(message="Room time updated successfully.")
    except APIError as e:
        raise e
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error.")

async def close_room(code: str, db: Session, username: str, user_id: str):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise APIError(status_code=404, detail="User not found.")
        if user.user_id != user_id:
            raise APIError(status_code=403, detail="User ID mismatch.")
        if user.role != "Host":
            raise APIError(status_code=403, detail="User is not authorized as Host.")
        db.query(User).filter(User.code == code).delete()
        db.query(Chat).filter(Chat.code == code).delete()
        db.query(File).filter(File.code == code).delete()
        db.query(TextModel).filter(TextModel.code == code).delete()
        db.query(Room).filter(Room.code == code).delete()
        db.commit()
        response = {
            "room": code,
            "type": "closeRoom",
            "data": {
                "message": f"Room {code} is being closed and all associated data is removed."
            }
        }
        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(code, json.dumps(response))
        return APIResponse.success(message="Room closed successfully and all associated data removed.")

    except APIError as e:
        raise e
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error.")

async def block_user(
    db, 
    code: str, 
    username: str, 
    user_id: str, 
    role: str, 
    block: str
):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.role == role,
            User.code == code
        ).first()

        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        response = {
            "room": code,
            "type": "block",
            "data": {
                "blocked_username": block,
                "current_participants": room.current_participant,
                "message": f"{block} has been blocked."
            }
        }

        try:
            if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                await websocket_manager.broadcast(code, json.dumps(response))
        except Exception as e:
            print(f"WebSocket Error: {e}")

        return APIResponse.success(message=f"User {block} blocked successfully.")

    except APIError as e:
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception as e:
        print(f"Error: {e}")
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")

async def store_blocked_ip(
    db: Session,
    room_code: str,
    username: str,
    user_id: str,
    user_role: str,
    request: Request
):
    try:
        room = db.query(Room).filter(Room.code == room_code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        user = db.query(User).filter(
            User.user_id == user_id,
            User.username == username,
            User.role == user_role,
            User.code == room_code
        ).first()
        if not user:
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        ip_address = request.client.host

        encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

        encrypted_ip = EncryptionMiddleware.encrypt({"ip_address": ip_address}, encryption_key)

        blocked_ips = json.loads(room.blocked) if room.blocked else []
        blocked_ips.append(encrypted_ip)

        room.blocked = json.dumps(blocked_ips)
        db.commit()

        return APIResponse.success(message="Blocked IP stored successfully.")

    except APIError as e:
        db.rollback()
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        db.rollback()
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")

async def update_room_restriction(code: str, db: Session, username: str, user_id: str, new_restrict: bool):
    try:
        room = db.query(Room).filter(Room.code == code).first()
        if not room:
            raise APIError(status_code=404, detail="Room doesn't exist.")

        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise APIError(status_code=404, detail="User not found.")

        if user.user_id != user_id:
            raise APIError(status_code=403, detail="User ID mismatch.")

        if user.role != "Host":
            raise APIError(status_code=403, detail="User is not authorized as Host.")

        room.restrict = bool(new_restrict)
        db.commit()
        db.refresh(room)

        response = {
            "room": code,
            "type": "changeRestriction",
            "data": {
                "restrict": room.restrict
            }
        }

        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(code, json.dumps(response))

        return APIResponse.success(message="Room restriction updated successfully.")
    except APIError as e:
        raise e
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error.")