from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
from utils.ApiError import APIError
from dotenv import load_dotenv
from starlette.concurrency import run_in_threadpool

load_dotenv()

FOLDER_ID = os.getenv("FOLDER_ID")
SERVICE_ACCOUNT_FILE = "service.json"
SCOPES = ["https://www.googleapis.com/auth/drive"]

def get_drive_service():
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        return build("drive", "v3", credentials=creds)
    except Exception as e:
        raise APIError(status_code=500, detail=f"Failed to authenticate Google Drive: {str(e)}")

def set_file_public(drive_service, file_id):
    try:
        permission = {
            "type": "anyone",
            "role": "reader"
        }
        drive_service.permissions().create(
            fileId=file_id,
            body=permission
        ).execute()
    except Exception as e:
        raise APIError(status_code=500, detail=f"Failed to set file permissions: {str(e)}")
async def upload_to_drive(file_path: str, mime_type: str):
    try:
        drive_service = get_drive_service()
        file_metadata = {
            "name": os.path.basename(file_path),
            "parents": [FOLDER_ID]
        }
        media = MediaFileUpload(file_path, mimetype=mime_type)
        try:
            uploaded_file = drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields="id"
            ).execute()
        except Exception as e:
            print(f"Error during Google Drive file upload: {e}")
            return None
        file_id = uploaded_file.get("id")
        try:
            set_file_public(drive_service, file_id)
        except Exception as e:
            print(f"Error setting file public: {e}")
            return None
        return file_id

    except Exception as e:
        print(f"Drive upload error (outer catch): {e}")
        return None

def delete_file_from_drive(file_id: str):
    try:
        if "_" in file_id:
            file_id = file_id.split("_", 1)[1]  
        drive_service = get_drive_service()
        drive_service.files().delete(fileId=file_id).execute()
        return True
    except Exception as e:
        raise APIError(status_code=500, detail=f"Failed to delete file from Google Drive: {str(e)}")

