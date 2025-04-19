import os
import json
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from models.file import File
from models.room import Room
from models.user import User
from utils.ApiError import APIError
from utils.ApiResponse import APIResponse
from utils.cloudinary import upload_file, delete_file
from cloudinary.exceptions import Error as CloudinaryError
from controllers.broadcast_controller import websocket_manager
from middlewares.additonalProtection import AdditionalEncryption
from middlewares.encryption import EncryptionMiddleware
from middlewares.decryption import DecryptionMiddleware
from utils.serviceDrive import upload_to_drive 

FILE_SIZE_LIMITS = {
    "image": 10 * 1024 * 1024,
    "video": 100 * 1024 * 1024,
    "audio": 50 * 1024 * 1024,
    "document": 20 * 1024 * 1024
}

FILE_CATEGORIES = {
    "jpg": "image", "jpeg": "image", "png": "image", "gif": "image",
    "mp4": "video", "mkv": "video", "mov": "video",
    "mp3": "audio", "wav": "audio",
    "pdf": "document", "zip": "document", "rar": "document"
}

async def validate_file(db: Session, room_code: str, username: str, user_id: str, file: UploadFile):
    room = db.query(Room).filter(Room.code == room_code).first()
    if not room:
        raise APIError(status_code=404, detail="Room not found.")
    
    encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)
    user = db.query(User).filter(User.user_id == user_id, User.username == username, User.code == room_code).first()
    if not user:
        raise APIError(status_code=404, detail="User not found or incorrect credentials.")
    
    file_extension = file.filename.split(".")[-1].lower()
    file_category = FILE_CATEGORIES.get(file_extension, "document")
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    max_size = FILE_SIZE_LIMITS.get(file_category, 20 * 1024 * 1024)
    
    if file_size > max_size:
        raise APIError(status_code=400, detail=f"File size exceeds the limit of {max_size / (1024 * 1024)} MB.")
    
    file_name = file.filename 
    
    if file_category == "document" or file_size > FILE_SIZE_LIMITS.get("image", 10 * 1024 * 1024):
        return await upload_to_google_drive(db, room_code, user_id, file, encryption_key, file_size, file_name)
    else:
        return await upload_to_cloudinary(db, room_code, user_id, file, encryption_key, file_size, file_name)

async def upload_to_cloudinary(db: Session, room_code: str, user_id: str, file: UploadFile, encryption_key, file_size, file_name):
    try:
        file.file.seek(0)
        cloudinary_url, cloudinary_id = upload_file(file.file, public_id=f"{room_code}_{file.filename}")
        
        if not cloudinary_id:
            raise CloudinaryError("Cloudinary upload failed")
        
        return await save_file(db, room_code, user_id, cloudinary_url, cloudinary_id, encryption_key, file_size, file_name)
    
    except CloudinaryError:
        return await upload_to_google_drive(db, room_code, user_id, file, encryption_key, file_size, file_name)

async def upload_to_google_drive(db: Session, room_code: str, user_id: str, file: UploadFile, encryption_key, file_size, file_name):
    print("1")
    temp_folder = os.path.join(os.getcwd(), "Backend", "public", "temp")
    os.makedirs(temp_folder, exist_ok=True)
    temp_file_path = os.path.join(temp_folder, file.filename)
    print(2)
    with open(temp_file_path, "wb") as f:
        print("read start")
        f.write(file.file.read())
        print("Read end")

    try:
        print("upload start")
        google_drive_file_id = upload_to_drive(temp_file_path, file.content_type)
        if not google_drive_file_id:
            raise Exception("Google Drive upload failed - no file ID returned.")
        print(f"Upload successful: {google_drive_file_id}")

        file_url = f"https://drive.google.com/uc?id={google_drive_file_id}&export=download"
        file_id = f"{room_code}_{google_drive_file_id}"
        
        return await save_file(db, room_code, user_id, file_url, file_id, encryption_key, file_size, file_name)
    except Exception as e:
        print(f"Upload exception: {str(e)}")
        raise APIError(status_code=500, detail=f"Google Drive upload failed: {str(e)}")

    
    finally:
        os.remove(temp_file_path)

async def save_file(db: Session, room_code: str, user_id: str, file_url: str, file_id: str, encryption_key, file_size, file_name):
    user = db.query(User).filter(User.user_id == user_id).first()
    username = user.username if user else "Unknown"
    new_file = File(
        content_id="", 
        code=room_code, 
        shared_by=user_id, 
        status="UPLOADED",
        file_name=file_name, 
        file_size=file_size  
    )
    
    db.add(new_file)
    db.flush() 

    encrypted_data = EncryptionMiddleware.encrypt({
        "file_id": file_id,
        "file_url": file_url,
        "shared_by": user_id,
        "file_size": file_size,
        "file_name": file_name
    }, encryption_key)

    new_file.content_id = encrypted_data["file_id"]
    new_file.url = encrypted_data["file_url"]
    new_file.file_name = encrypted_data["file_name"]  
    new_file.file_size = encrypted_data["file_size"] 
    
    db.commit()
    
    response = {
        "room": room_code,
        "type": "file",
        "data": {
            "file_url": file_url,
            "file_id": file_id,
            "shared_by": username,
            "file_size": file_size,
            "file_name": file_name  
        }
    }
    
    try:
        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(room_code, json.dumps(response))
    except Exception:
        pass
    
    return APIResponse.success(message="File uploaded successfully.", data={"username": username, "file_name": file_name})

async def get_file(db: Session, room_code: str, username: str, user_id: str):
    room = db.query(Room).filter(Room.code == room_code).first()
    if not room:
        raise APIError(status_code=404, detail="Room not found.")

    encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)

    user = db.query(User).filter(
        User.user_id == user_id,
        User.username == username,
        User.code == room_code
    ).first()
    if not user:
        raise APIError(status_code=404, detail="User not found or invalid credentials.")

    files = db.query(File).filter(File.code == room_code).all()

    file_data = []
    for file in files:
        encrypted_fields = {
            "file_id": file.content_id,
            "file_url": file.url,
            "file_name": file.file_name,
            "file_size": file.file_size
        }

        decrypted = DecryptionMiddleware.decrypt(encrypted_fields, encryption_key)
        
        file_data.append({
            "file_id": decrypted.get("file_id"),
            "file_url": decrypted.get("file_url"),
            "file_name": decrypted.get("file_name"),
            "file_size": decrypted.get("file_size"),
            "shared_by": file.shared_by
        })

    return APIResponse.success(message="Files fetched successfully.", data={"files": file_data})

async def delete_file(db: Session, room_code: str, user_id: str, username: str, file_id: str):
    room = db.query(Room).filter(Room.code == room_code).first()
    if not room:
        raise APIError(status_code=404, detail="Room not found.")

    user = db.query(User).filter(
        User.user_id == user_id,
        User.username == username,
        User.code == room_code
    ).first()
    if not user:
        raise APIError(status_code=404, detail="User not found or invalid credentials.")

    encryption_key = AdditionalEncryption.decrypt_key(room.encryption_key)
    files = db.query(File).filter(File.code == room_code).all()

    target_file = None
    for f in files:
        try:
            decrypted = DecryptionMiddleware.decrypt({
                "file_id": f.content_id
            }, encryption_key)
            if decrypted.get("file_id") == file_id:
                target_file = f
                break
        except Exception:
            continue

    if not target_file:
        raise APIError(status_code=404, detail="File not found.")

    try:
        delete_file(file_id)
    except Exception:
        pass  

    db.delete(target_file)
    db.commit()

    return APIResponse.success(message="File deleted successfully.")
