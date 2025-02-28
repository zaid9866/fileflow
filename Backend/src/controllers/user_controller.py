import uuid
from sqlalchemy.orm import Session
from models.user import User
from utils.GenerateUsername import generate_username
from utils.ApiResponse import APIResponse
from utils.ApiError import APIError  

def get_username(code: str, db: Session):
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

def check_username(request, db: Session):
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

def create_user(request, db: Session):
    try:
        if not request.username.strip():
            raise APIError(status_code=400, detail="Username is required.")
        if not request.code.strip():
            raise APIError(status_code=400, detail="Room code is required.")
        if not request.role.strip():
            raise APIError(status_code=400, detail="Role is required.")

        existing_user = db.query(User).filter(User.username == request.username, User.code == request.code).first()
        if existing_user:
            raise APIError(status_code=409, detail="Username already taken in this room, please try a different one.")

        new_user = User(
            user_id=str(uuid.uuid4()), 
            username=request.username, 
            code=request.code, 
            role=request.role
        )

        db.add(new_user)
        db.commit()

        return APIResponse.success(
            message="User created successfully.",
            data={"user_id": new_user.user_id, "username": new_user.username, "code": new_user.code, "role": new_user.role}
        )

    except APIError as e:
        raise e  
    except Exception as e:
        print("Unexpected Error:", str(e))
        db.rollback()
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")
