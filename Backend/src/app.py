from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.connection import engine
from models.room import Base as RoomBase
from models.user import Base as UserBase
from models.chat import Base as ChatBase
from models.sharedcontent import Base as SharedContentBase
from routes.user_route import user_router;
from routes.room_route import room_router;

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

RoomBase.metadata.create_all(bind=engine)     
UserBase.metadata.create_all(bind=engine) 
ChatBase.metadata.create_all(bind=engine)
SharedContentBase.metadata.create_all(bind=engine) 

app.include_router(room_router, prefix="/room", tags=["Room"])
app.include_router(user_router, prefix="/user", tags=["User"])
# app.include_router(chat_routes.router, prefix="/chat", tags=["Chat"])
# app.include_router(shared_content_routes.router, prefix="/shared-content", tags=["Shared Content"])

@app.get("/")
def home():
    return {"message": "Welcome to FastAPI Server"}
