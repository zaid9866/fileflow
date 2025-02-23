import base64
from cryptography.fernet import Fernet

def generate_encryption_key():
    key = Fernet.generate_key()  
    return base64.urlsafe_b64encode(key).decode() 
