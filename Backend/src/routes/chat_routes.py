from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from models.chat import Chat  

chat_router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_code: str):
        await websocket.accept()
        if room_code not in self.active_connections:
            self.active_connections[room_code] = []
        self.active_connections[room_code].append(websocket)

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in self.active_connections:
            self.active_connections[room_code].remove(websocket)
            if not self.active_connections[room_code]:  
                del self.active_connections[room_code]

    async def broadcast(self, room_code: str, message: dict):
        if room_code in self.active_connections:
            for connection in self.active_connections[room_code]:
                await connection.send_json(message)

manager = ConnectionManager()

@chat_router.websocket("/ws/{room_code}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_code: str, username: str):
    await manager.connect(websocket, room_code)
    await manager.broadcast(room_code, {"message": f"{username} joined the chat", "username": username})

    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast(room_code, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_code)
        await manager.broadcast(room_code, {"message": f"{username} left the chat", "username": username})


@chat_router.get("/getchat/{room_code}")
def get_chat(room_code: str):
    # Controller ko call karna hai
    # return getChat(room_code)  
    pass

@chat_router.post("/addchat")
async def add_chat(chat_data: dict):
    # Controller me data validation hoga
    # response = addChat(chat_data)  
    await manager.broadcast(chat_data["code"], {
        "username": chat_data["sender"],
        "message": chat_data["message"],
        "time": chat_data["timing"]
    })  
    return {"status": "success", "message": "Chat broadcasted"}
