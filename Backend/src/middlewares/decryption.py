from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

class DecryptionMiddleware:
    @staticmethod
    def decrypt(encrypted_data: dict, encryption_key: bytes):
        if len(encryption_key) != 32:
            raise ValueError("Invalid encryption key length. Must be 32 bytes for AES-256.")

        decrypted_data = {}
        for k, v in encrypted_data.items():
            try:
                encrypted_bytes = base64.b64decode(v)
                iv, ciphertext = encrypted_bytes[:16], encrypted_bytes[16:]

                cipher = AES.new(encryption_key, AES.MODE_CBC, iv)
                decrypted_data[k] = unpad(cipher.decrypt(ciphertext), AES.block_size).decode()

            except Exception as e:
                print(f"Decryption failed for key {k}: {str(e)}")  
                decrypted_data[k] = None  

        return decrypted_data