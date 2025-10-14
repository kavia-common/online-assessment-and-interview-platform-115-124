from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Interview(Base):
    """Interview schedule and notes for a candidate."""
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    candidate_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    interviewer_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    scheduled_at: Mapped[datetime] = mapped_column(DateTime)
    duration_min: Mapped[int] = mapped_column(Integer, default=30)
    location: Mapped[str | None] = mapped_column(String(255), default=None)
    notes: Mapped[str | None] = mapped_column(Text, default=None)

    candidate = relationship("User", foreign_keys=[candidate_id])
    interviewer = relationship("User", foreign_keys=[interviewer_id])
