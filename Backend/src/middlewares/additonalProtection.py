import os
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from dotenv import load_dotenv

load_dotenv()
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY is missing in .env file")

ENCRYPTION_KEY = base64.urlsafe_b64decode(ENCRYPTION_KEY)

class EncryptionMiddleware:
    @staticmethod
    def encrypt_key(key: str) -> str:
        iv = os.urandom(16) 
        cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()

        pad_length = 16 - (len(key) % 16)
        padded_key = key + chr(pad_length) * pad_length

        ciphertext = encryptor.update(padded_key.encode()) + encryptor.finalize()
        return base64.b64encode(iv + ciphertext).decode()

    @staticmethod
    def decrypt_key(encrypted_key: str) -> str:
        encrypted_data = base64.b64decode(encrypted_key)
        iv, ciphertext = encrypted_data[:16], encrypted_data[16:]

        cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()

        decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()

        pad_length = decrypted_padded[-1]
        return decrypted_padded[:-pad_length].decode()
