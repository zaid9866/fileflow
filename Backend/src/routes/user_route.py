from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import get_db
from controllers.user_controller import get_username, check_username, create_user, get_users_by_code, remove_user
from pydantic import BaseModel

user_router = APIRouter()

class VerifyUsernameRequest(BaseModel):
    username: str
    code: str

class CreateUserRequest(BaseModel):
    username: str
    code: str
    role: str

class RemoveUserRequest(BaseModel):
    code: str
    username: str
    guestName: str
    userId: str
    role: str

@user_router.get("/getUsername")
def generate_username(code: str, db: Session = Depends(get_db)):
    return get_username(code, db)

@user_router.post("/verifyUsername")
def verify_username(request: VerifyUsernameRequest, db: Session = Depends(get_db)):
    return check_username(request, db)

@user_router.post("/createUser")
async def register_user(request: CreateUserRequest, db: Session = Depends(get_db)):
    return await create_user(request, db)

@user_router.get("/getUser")
def get_users(code: str, db: Session = Depends(get_db)):
    return get_users_by_code(code, db)

@user_router.post("/removeUser")
async def remove_user_route(request: RemoveUserRequest, db: Session = Depends(get_db)):
    return await remove_user(request, db)