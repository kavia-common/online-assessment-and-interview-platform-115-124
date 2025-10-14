from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError, jwt

from app.core.config import settings

router = APIRouter()

# Simple in-memory connection registries
chat_rooms: Dict[str, Set[WebSocket]] = {}
hr_live_clients: Set[WebSocket] = set()

def _is_token_valid(token: str) -> bool:
    """Very light validation: decode but ignore claims for now."""
    try:
        jwt.decode(token, settings.APP_SECRET_KEY, algorithms=["HS256"])
        return True
    except JWTError:
        return False

# PUBLIC_INTERFACE
@router.websocket("/ws/chat")
async def chat_ws(websocket: WebSocket, room: str = Query(default="general"), token: str | None = Query(default=None)):
    """
    WebSocket chat endpoint.

    Query params:
    - room: logical room/channel
    - token: JWT token for authentication (validated signature only)
    """
    if token and not _is_token_valid(token):
        await websocket.close(code=4403)
        return
    await websocket.accept()
    room_set = chat_rooms.setdefault(room, set())
    room_set.add(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast to room
            for ws in list(room_set):
                if ws.client_state.name == "CONNECTED":
                    await ws.send_json({"room": room, "message": data})
    except WebSocketDisconnect:
        pass
    finally:
        room_set.discard(websocket)
        if not room_set:
            chat_rooms.pop(room, None)

# PUBLIC_INTERFACE
@router.websocket("/ws/hr/live")
async def hr_live_ws(websocket: WebSocket, token: str | None = Query(default=None)):
    """
    WebSocket for HR live monitoring.

    Query params:
    - token: JWT token for authentication (validated signature only)
    """
    if token and not _is_token_valid(token):
        await websocket.close(code=4403)
        return
    await websocket.accept()
    hr_live_clients.add(websocket)
    try:
        # Keep alive; this endpoint can be pushed to by server components
        while True:
            # Echo pings or control messages from client if any
            _ = await websocket.receive_text()
            await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        pass
    finally:
        hr_live_clients.discard(websocket)

# PUBLIC_INTERFACE
async def hr_broadcast(event: dict):
    """Broadcast an HR live event to all connected HR clients."""
    for ws in list(hr_live_clients):
        try:
            if ws.client_state.name == "CONNECTED":
                await ws.send_json(event)
        except Exception:
            # Drop broken connection
            hr_live_clients.discard(ws)
