from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from cryptography.fernet import Fernet
import json

class DecryptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        body = await request.body()

        encryption_key = request.headers.get("X-Encryption-Key")

        if not encryption_key:
            return Response(content=json.dumps({"error": "Encryption key missing"}), status_code=400)

        try:
            cipher = Fernet(encryption_key.encode())  
        except Exception:
            return Response(content=json.dumps({"error": "Invalid encryption key"}), status_code=400)

        try:
            decrypted_body = cipher.decrypt(body)  
            request.state.decrypted_body = decrypted_body  
        except Exception:
            return Response(content=json.dumps({"error": "Decryption failed"}), status_code=400)

        response = await call_next(request)
        return response
