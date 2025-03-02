from fastapi import WebSocket
from typing import Dict, List
import asyncio

class WebSocketManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, code: str, websocket: WebSocket):
        await websocket.accept()
        if code not in self.rooms:
            self.rooms[code] = []
        self.rooms[code].append(websocket)

    async def disconnect(self, code: str, websocket: WebSocket):
        if code in self.rooms:
            self.rooms[code].remove(websocket)
            if not self.rooms[code]:  
                del self.rooms[code]

    async def broadcast(self, code: str, message: str):
        if code in self.rooms:
            await asyncio.gather(*[
                ws.send_text(message) for ws in self.rooms[code]
            ])

websocket_manager = WebSocketManager()
