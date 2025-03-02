from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Path
import json
from controllers.broadcast_controller import websocket_manager

router = APIRouter()

@router.websocket("/ws/{code}/{username}")
async def websocket_endpoint(
    websocket: WebSocket,
    code: str,
    username: str = Path(..., title="Username")
):
    username = username.replace("%20", " ")  
    await websocket_manager.connect(code, websocket)
    print(f"User '{username}' connected to room: {code}")

    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received from {username}: {data}")
    except WebSocketDisconnect:
        await websocket_manager.disconnect(code, websocket)
        print(f"User '{username}' disconnected from room: {code}")
