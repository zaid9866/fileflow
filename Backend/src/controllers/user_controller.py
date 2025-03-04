import uuid
import json
from sqlalchemy.orm import Session
from models.user import User
from models.room import Room
from utils.ApiResponse import APIResponse
from utils.ApiError import APIError  
from controllers.broadcast_controller import websocket_manager
from faker import Faker
fake = Faker()

def get_username(code: str, db: Session):
    try:
        if not code or code.strip() == "":
            raise APIError(status_code=400, detail="Room code is required.")
        
        for _ in range(100):  
            new_username = fake.name()
            if len(new_username) > 15:
                continue  

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

async def create_user(request, db: Session):
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

        room = db.query(Room).filter(Room.code == request.code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        new_user = User(
            user_id=str(uuid.uuid4()), 
            username=request.username, 
            code=request.code, 
            role=request.role
        )

        db.add(new_user)
        db.commit()

        participants_count = db.query(User).filter(User.code == request.code).count()
        formatted_end_time = room.end_timing.strftime("%H:%M:%S") if room.end_timing else "00:00:00"

        response = {
            "room": request.code,
            "type": "user",
            "user": request.username,
            "data": {
                "current_participants": participants_count,
            }
        }

        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(request.code, json.dumps(response)) 

        return APIResponse.success( 
            message="User created successfully.",
            data={
                "user_id": new_user.user_id,
                "username": new_user.username,
                "code": new_user.code,
                "role": new_user.role,
                "time": formatted_end_time  
            }
        )

    except APIError as e:
        raise e  
    except Exception as e:
        print("Unexpected Error:", str(e))
        db.rollback()
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")

def get_users_by_code(code: str, db: Session):
    try:
        if not code or code.strip() == "":
            raise APIError(status_code=400, detail="Room code is required.")

        users = db.query(User).filter(User.code == code).all()

        if not users:
            raise APIError(status_code=404, detail="No users found for this room code.")

        return APIResponse.success(
            message="Users fetched successfully.",
            data=[{"name": user.username, "role": user.role} for user in users]
        )

    except APIError as e:
        raise e  
    except Exception as e:
        print("Unexpected Error:", str(e))
        db.rollback()
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")
    
async def remove_user(request, db: Session):
    try:
        if not request.code.strip():
            raise APIError(status_code=400, detail="Room code is required.")

        if not request.username.strip():
            raise APIError(status_code=400, detail="Username is required.")

        existing_user = db.query(User).filter(User.username == request.username, User.code == request.code).first()
        
        if not existing_user:
            raise APIError(status_code=404, detail="User not found in this room.")

        room = db.query(Room).filter(Room.code == request.code).first()
        if not room:
            raise APIError(status_code=404, detail="Room not found.")

        if room.current_participant > 0:
            room.current_participant -= 1

        db.delete(existing_user)
        db.commit()

        response = {
            "room": request.code,
            "type": "removeUser",
            "data": {
                "username": request.username,
                "current_participants": room.current_participant,
                "message": "{request.username} has been removed from the room."
            }
        }

        if hasattr(websocket_manager, "broadcast") and callable(websocket_manager.broadcast):
            await websocket_manager.broadcast(request.code, json.dumps(response))

        return APIResponse.success(
            message="User removed successfully.",
            data={"username": request.username, "current_particpant": room.current_participant}
        )

    except APIError as e:
        raise e  
    except Exception as e:
        print("Unexpected Error:", str(e))
        db.rollback()
        raise APIError(status_code=500, detail="Internal Server Error. Please try again later.")
