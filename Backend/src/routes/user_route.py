from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from controllers.user_controller import get_username, check_username, create_user
from pydantic import BaseModel

user_router = APIRouter()

class VerifyUsernameRequest(BaseModel):
    username: str
    code: str

class CreateUserRequest(BaseModel):
    username: str
    code: str
    role: str

@user_router.get("/getUsername")
def generate_username(code: str, db: Session = Depends(get_db)):
    return get_username(code, db)

@user_router.post("/verifyUsername")
def verify_username(request: VerifyUsernameRequest, db: Session = Depends(get_db)):
    return check_username(request, db)

@user_router.post("/createUser")
def register_user(request: CreateUserRequest, db: Session = Depends(get_db)):
    return create_user(request, db)
