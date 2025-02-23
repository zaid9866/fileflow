from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.connection import get_db
from models.user import User
from utils.GenerateUsername import generate_username
from utils.ApiResponse import APIResponse
from utils.ApiError import APIError  

user_router = APIRouter()

class VerifyUsernameRequest(BaseModel):
    username: str
    code: str

@user_router.get("/getUsername")
def get_username(code: str, db: Session = Depends(get_db)):
    try:
        if not code or code.strip() == "":
            raise APIError(status_code=400, detail="Room code is required.")

        for _ in range(100):  
            new_username = generate_username()
            existing_user = db.query(User).filter(User.username == new_username, User.code == code).first()

            if not existing_user:
                return APIResponse.success(
                    message="Generated new username.",
                    data={"username": new_username}
                )

        raise APIError(status_code=500, detail="Failed to generate a unique username. Try again.")

    except APIError as e:
        raise e  
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

@user_router.post("/verifyUsername")
def check_username(request: VerifyUsernameRequest, db: Session = Depends(get_db)):
    try:
        if not request.code.strip():
            raise APIError(status_code=400, detail="Room code is required.")

        if not request.username.strip():
            raise APIError(status_code=400, detail="Username is required.")

        existing_user = db.query(User).filter(User.username == request.username, User.code == request.code).first()
        
        if existing_user:
            raise APIError(status_code=409, detail="Username already taken in this room, please try a different one.")

        return APIResponse.success(
            message="Username is available.",
            data={"status": "success"}
        )

    except APIError as e:
        raise e  
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")
