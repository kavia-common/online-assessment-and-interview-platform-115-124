from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class ProctorEvent(Base):
    """Logs of client-side events during a proctored test session."""
    __tablename__ = "proctor_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey("attempts.id", ondelete="CASCADE"), index=True)
    session_id: Mapped[str] = mapped_column(String(64), index=True)  # client session identifier
    event_type: Mapped[str] = mapped_column(String(64), index=True)
    payload: Mapped[dict | None] = mapped_column(JSON, default=None)
    occurred_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    attempt = relationship("Attempt")

# Index for faster HR live querying by session and time
Index("ix_proctor_events_session_time", ProctorEvent.session_id, ProctorEvent.occurred_at)
