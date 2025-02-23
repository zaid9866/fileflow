from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import os
import base64

# AES-256 requires a 32-byte secret key
SECRET_KEY = b"your-32-byte-secret-key------"  # Make sure to use the same key for decryption

def encrypt_message(message):
    try:
        # Generate a random 16-byte IV (Initialization Vector)
        iv = os.urandom(16)

        # Pad the message to make it a multiple of 16 bytes
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_message = padder.update(message.encode()) + padder.finalize()

        # Create an AES cipher in CBC mode
        cipher = Cipher(algorithms.AES(SECRET_KEY), modes.CBC(iv))
        encryptor = cipher.encryptor()

        # Encrypt the padded message
        encrypted_text = encryptor.update(padded_message) + encryptor.finalize()

        # Combine IV and encrypted message, then encode it in Base64
        encrypted_data = iv + encrypted_text
        return base64.b64encode(encrypted_data).decode("utf-8")
    
    except Exception as e:
        return f"Encryption error: {str(e)}"
