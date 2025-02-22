from fastapi import FastAPI
from db.connection import engine
from models.room import Base as RoomBase
from models.user import Base as UserBase
from models.chat import Base as ChatBase
from models.sharedcontent import Base as SharedContentBase
# from routes import room_routes, user_routes, chat_routes, shared_content_routes

app = FastAPI()

RoomBase.metadata.create_all(bind=engine)     
UserBase.metadata.create_all(bind=engine) 
ChatBase.metadata.create_all(bind=engine)
SharedContentBase.metadata.create_all(bind=engine) 

# app.include_router(room_routes.router, prefix="/room", tags=["Room"])
# app.include_router(user_routes.router, prefix="/user", tags=["User"])
# app.include_router(chat_routes.router, prefix="/chat", tags=["Chat"])
# app.include_router(shared_content_routes.router, prefix="/shared-content", tags=["Shared Content"])

@app.get("/")
def home():
    return {"message": "Welcome to FastAPI Server"}
