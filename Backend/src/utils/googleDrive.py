import os
import google.auth
from googleapiclient.discovery import build
from google.auth.transport.requests import Request  
from google.oauth2.credentials import Credentials
from googleapiclient.http import MediaFileUpload
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/drive']

def authenticate_google_drive():
    creds = None
    
    CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    REFRESH_TOKEN = os.getenv("GOOGLE_REFRESH_TOKEN")

    if CLIENT_ID and CLIENT_SECRET and REFRESH_TOKEN:
        creds = Credentials.from_authorized_user_info({
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "refresh_token": REFRESH_TOKEN
        }, SCOPES)
    else:
        raise Exception("Missing Google Drive API credentials. Please set CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN in your .env file.")

    return build('drive', 'v3', credentials=creds)

def make_file_public(file_id):
    drive_service = authenticate_google_drive()
    permission = {
        'type': 'anyone',  
        'role': 'reader'   
    }
    drive_service.permissions().create(
        fileId=file_id,
        body=permission
    ).execute()

def upload_file(file_path, mime_type):
    drive_service = authenticate_google_drive()

    file_metadata = {'name': os.path.basename(file_path)}
    media = MediaFileUpload(file_path, mimetype=mime_type)

    request = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id"
    )
    response = request.execute()

    if 'id' in response:
        file_id = response['id']
        make_file_public(file_id)
        view_url = f"https://drive.google.com/file/d/{file_id}/view"
        print(f"File uploaded successfully: {view_url}")
        return view_url  
    else:
        print("Failed to upload file.")
        return None

def retrieve_file(file_id):
    view_url = f"https://drive.google.com/file/d/{file_id}/view"
    print(f"Download link: {view_url}")
    return view_url  

def delete_file(file_id):
    drive_service = authenticate_google_drive()
    
    try:
        drive_service.files().delete(fileId=file_id).execute()
        print(f"File with ID {file_id} has been deleted successfully.")
    except Exception as e:
        print(f"Error deleting file: {e}")
