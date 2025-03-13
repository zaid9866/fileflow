import os
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from dotenv import load_dotenv

load_dotenv()
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY is missing in .env file")

ENCRYPTION_KEY = base64.b64decode(ENCRYPTION_KEY)
if len(ENCRYPTION_KEY) != 32:
    raise ValueError("Invalid encryption key length. Must be 32 bytes for AES-256.")

class AdditionalEncryption:
    @staticmethod
    def encrypt_key(key_bytes: bytes) -> str:
        iv = os.urandom(16) 
        cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)

        ciphertext = cipher.encrypt(pad(key_bytes, AES.block_size))
        
        return base64.b64encode(iv + ciphertext).decode()

    @staticmethod
    def decrypt_key(encrypted_key: str) -> bytes:
        encrypted_data = base64.b64decode(encrypted_key)
        iv, ciphertext = encrypted_data[:16], encrypted_data[16:]

        cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)
        decrypted_padded = cipher.decrypt(ciphertext)

        return unpad(decrypted_padded, AES.block_size)  