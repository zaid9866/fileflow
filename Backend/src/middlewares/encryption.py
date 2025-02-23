from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from cryptography.fernet import Fernet
import json

class EncryptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        body = await request.body()

        encryption_key = request.headers.get("X-Encryption-Key")

        if not encryption_key:
            return Response(content=json.dumps({"error": "Encryption key missing"}), status_code=400)

        try:
            cipher = Fernet(encryption_key.encode()) 
        except Exception:
            return Response(content=json.dumps({"error": "Invalid encryption key"}), status_code=400)

        if body:
            encrypted_body = cipher.encrypt(body)  
            request.state.encrypted_body = encrypted_body  
        
        response = await call_next(request)
        return response
