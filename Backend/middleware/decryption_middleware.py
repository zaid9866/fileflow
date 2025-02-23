from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import base64

# Use the same 32-byte secret key as in encryption
SECRET_KEY = b"your-32-byte-secret-key------"  # Must match the key used in encryption

def decrypt_message(encrypted_message):
    try:
        # Decode the Base64-encoded encrypted data
        encrypted_data = base64.b64decode(encrypted_message)

        # Extract IV (first 16 bytes) and the actual encrypted text
        iv = encrypted_data[:16]
        encrypted_text = encrypted_data[16:]

        # Create an AES cipher in CBC mode
        cipher = Cipher(algorithms.AES(SECRET_KEY), modes.CBC(iv))
        decryptor = cipher.decryptor()

        # Decrypt the message
        decrypted_padded_message = decryptor.update(encrypted_text) + decryptor.finalize()

        # Remove padding
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        decrypted_message = unpadder.update(decrypted_padded_message) + unpadder.finalize()

        return decrypted_message.decode("utf-8")
    
    except Exception as e:
        return f"Decryption error: {str(e)}"
