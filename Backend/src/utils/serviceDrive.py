from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
from utils.ApiError import APIError
from dotenv import load_dotenv

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
        print("inside upload")

        media = MediaFileUpload(file_path, mimetype=mime_type)
        print("Drive upload started")
        uploaded_file = drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id"
        ).execute()

        print("end drive upload")

        file_id = uploaded_file.get("id")

        set_file_public(drive_service, file_id)

        return file_id  

    except Exception as e:
        raise APIError(status_code=500, detail=f"Google Drive upload failed: {str(e)}")

def delete_file_from_drive(file_id: str):
    try:
        drive_service = get_drive_service()
        drive_service.files().delete(fileId=file_id).execute()
        return True
    except Exception as e:
        raise APIError(status_code=500, detail=f"Failed to delete file from Google Drive: {str(e)}")
