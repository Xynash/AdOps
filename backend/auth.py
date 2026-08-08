import hashlib
import secrets

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return hashed.hex(), salt

def verify_password(password, salt, stored_hash):
    hashed, _ = hash_password(password, salt)
    return hashed == stored_hash
