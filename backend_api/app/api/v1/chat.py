from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from pydantic import BaseModel, Field

from app.core.db import get_db
from app.models.chat import ChatThread, ChatMessage

router = APIRouter()

class ThreadOut(BaseModel):
    id: int
    channel: str
    class Config:
        from_attributes = True

class MessageOut(BaseModel):
    id: int
    thread_id: int
    content: str
    created_at: str
    class Config:
        from_attributes = True

class MessageIn(BaseModel):
    content: str = Field(..., description="Message text content")

# PUBLIC_INTERFACE
@router.get(
    "/threads",
    response_model=List[ThreadOut],
    summary="List chat threads",
    description="Returns chat threads filtered by channel if provided.",
    operation_id="chat_list_threads",
)
def list_threads(
    db: Session = Depends(get_db),
    channel: Optional[str] = Query(default=None, description="Filter by channel"),
):
    q = select(ChatThread)
    if channel:
        q = q.where(ChatThread.channel == channel)
    rows = db.execute(q).scalars().all()
    return rows

# PUBLIC_INTERFACE
@router.get(
    "/threads/{thread_id}/messages",
    response_model=List[MessageOut],
    summary="List messages for a thread",
    description="Returns messages ordered by created_at desc, limited by size.",
    operation_id="chat_list_messages",
)
def list_thread_messages(
    thread_id: int,
    db: Session = Depends(get_db),
    size: int = Query(50, ge=1, le=200),
):
    q = select(ChatMessage).where(ChatMessage.thread_id == thread_id).order_by(desc(ChatMessage.created_at)).limit(size)
    rows = db.execute(q).scalars().all()
    return rows

# PUBLIC_INTERFACE
@router.post(
    "/threads/{thread_id}/messages",
    response_model=MessageOut,
    summary="Create a new message",
    description="Creates a new message in the specified thread.",
    operation_id="chat_create_message",
)
def create_message(
    thread_id: int,
    payload: MessageIn,
    db: Session = Depends(get_db),
):
    msg = ChatMessage(thread_id=thread_id, content=payload.content, sender_id=None)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
