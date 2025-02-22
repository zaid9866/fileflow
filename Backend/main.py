from fastapi import FastAPI
from backend.routes.room_routes import room_router
from backend.routes.user_routes import user_router
from backend.db.connection import engine, Base
from backend.routes.chat_routes import chat_router


app = FastAPI()

# Database tables create karna (Agar pehle nahi hai toh)
Base.metadata.create_all(bind=engine)

# Routes register karna
app.include_router(room_router)
app.include_router(user_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "FileFlow Backend is running!"}
