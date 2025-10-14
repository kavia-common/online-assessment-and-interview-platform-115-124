from datetime import datetime
from sqlalchemy import String, DateTime, JSON, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base
import enum

class EmailStatus(str, enum.Enum):
    queued = "queued"
    sending = "sending"
    sent = "sent"
    failed = "failed"

class EmailJob(Base):
    """Persisted email job for async processing."""
    __tablename__ = "email_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    to_address: Mapped[str] = mapped_column(String(255))
    subject: Mapped[str] = mapped_column(String(255))
    template: Mapped[str | None] = mapped_column(String(100), default=None)
    payload: Mapped[dict | None] = mapped_column(JSON, default=None)
    status: Mapped[EmailStatus] = mapped_column(Enum(EmailStatus), default=EmailStatus.queued, index=True)
    attempt_count: Mapped[int] = mapped_column(Integer, default=0)
    last_error: Mapped[str | None] = mapped_column(String(500), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
