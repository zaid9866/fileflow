import os
import json
from sqlalchemy.orm import Session
from fastapi import UploadFile, File, Form
from models.file import File
from models.room import Room
from models.user import User
from utils.ApiError import APIError
from utils.ApiResponse import APIResponse
from utils.cloudinary import upload_file
from utils.googleDrive import upload_file as upload_to_drive
from cloudinary.exceptions import Error as CloudinaryError
from controllers.broadcast_controller import websocket_manager
from middlewares.additonalProtection import AdditionalEncryption
from middlewares.encryption import EncryptionMiddleware

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

async def validate_file(
    db: Session,
    room_code: str = Form(...),
    username: str = Form(...),
    user_id: str = Form(...),
    file: UploadFile = File()
):
    try:
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
            raise APIError(status_code=404, detail="User not found or incorrect credentials.")

        if not file:
            raise APIError(status_code=400, detail="No file provided.")

        file_extension = file.filename.split(".")[-1].lower()
        file_category = FILE_CATEGORIES.get(file_extension, "document")

        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        max_size = FILE_SIZE_LIMITS.get(file_category, 20 * 1024 * 1024)
        if file_size > max_size:
            raise APIError(
                status_code=400,
                detail=f"File size exceeds the limit of {max_size / (1024 * 1024)} MB."
            )

        new_file = File(
            content_id="",
            code=room_code,
            shared_by=user_id,
            status="PENDING"
        )
        db.add(new_file)
        db.flush()

        file_url, file_id, content_id = None, None, None

        temp_folder = "public/temp"
        os.makedirs(temp_folder, exist_ok=True)
        temp_file_path = os.path.join(temp_folder, file.filename)

        if file_category == "document":
            with open(temp_file_path, "wb") as f:
                f.write(file.file.read())

            try:
                google_drive_file_id = upload_to_drive(temp_file_path, file.content_type)

                if not google_drive_file_id:
                    raise Exception("Google Drive upload failed.")

                file_url = f"https://drive.google.com/uc?id={google_drive_file_id}"
                file_id = f"{room_code}_{google_drive_file_id}"
                content_id = file_id

            except Exception:
                db.rollback()
                return APIResponse.error(status_code=500, message="Google Drive upload failed.")

            finally:
                os.remove(temp_file_path)

        elif file_size <= max_size:
            try:
                file.file.seek(0)
                cloudinary_url, cloudinary_id = upload_file(file.file, public_id=f"{room_code}_{file.filename}")

                if not cloudinary_id:
                    raise CloudinaryError("Cloudinary upload failed")

                file_url = cloudinary_url
                file_id = cloudinary_id
                content_id = file_id

            except CloudinaryError:
                file.file.seek(0)
                with open(temp_file_path, "wb") as f:
                    f.write(file.file.read())

                try:
                    google_drive_file_id = upload_to_drive(temp_file_path, file.content_type)

                    file_url = f"https://drive.google.com/uc?id={google_drive_file_id}"
                    file_id = f"{room_code}_{google_drive_file_id}"
                    content_id = file_id

                except Exception:
                    db.rollback()
                    return APIResponse.error(status_code=500, message="File upload failed.")

                finally:
                    os.remove(temp_file_path)

        if file_url:
            encrypted_data = EncryptionMiddleware.encrypt({
                "file_id": content_id,
                "file_url": file_url,
                "shared_by": user_id
            }, encryption_key)

            new_file.content_id = encrypted_data["file_id"]
            new_file.url = encrypted_data["file_url"]
            new_file.status = "UPLOADED"

            db.commit()

            response = {
                "room": room_code,
                "type": "file",
                "data": {
                    "username": username,
                    "file_url": file_url,
                    "file_id": file_id
                }
            }

            try:
                if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
                    await websocket_manager.broadcast(room_code, json.dumps(response))
            except Exception:
                pass

            return APIResponse.success(message="File uploaded successfully.")

        new_file.status = "FAILED"
        db.commit()
        return APIResponse.error(status_code=500, message="File upload failed. Please try again later.")

    except APIError as e:
        db.rollback()
        return APIResponse.error(status_code=e.status_code, message=e.detail)

    except Exception:
        db.rollback()
        return APIResponse.error(status_code=500, message="Internal Server Error. Please try again later.")
