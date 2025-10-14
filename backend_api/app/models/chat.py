from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class ChatThread(Base):
    """A chat thread/channel owned by a user (could be shared via routing rules)."""
    __tablename__ = "chat_threads"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    channel: Mapped[str] = mapped_column(String(100), index=True)  # e.g., "hr", "support", "employee"
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="chat_threads")
    messages: Mapped[list["ChatMessage"]] = relationship("ChatMessage", back_populates="thread", cascade="all,delete")

class ChatMessage(Base):
    """A message within a chat thread."""
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    thread_id: Mapped[int] = mapped_column(ForeignKey("chat_threads.id", ondelete="CASCADE"), index=True)
    sender_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    thread = relationship("ChatThread", back_populates="messages")

Index("ix_chat_messages_thread_time", ChatMessage.thread_id, ChatMessage.created_at)
