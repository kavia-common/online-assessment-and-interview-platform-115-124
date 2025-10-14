from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, Enum, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
import enum

class AttemptStatus(str, enum.Enum):
    in_progress = "in_progress"
    submitted = "submitted"
    graded = "graded"
    canceled = "canceled"

class Attempt(Base):
    """An attempt of an assignment by a candidate with answers."""
    __tablename__ = "attempts"
    __table_args__ = (
        UniqueConstraint("assignment_id", "candidate_id", name="uq_attempt_assignment_candidate"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id", ondelete="CASCADE"), index=True)
    candidate_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)
    duration_sec: Mapped[int | None] = mapped_column(Integer, default=None)
    status: Mapped[AttemptStatus] = mapped_column(Enum(AttemptStatus), default=AttemptStatus.in_progress, index=True)
    total_score: Mapped[int | None] = mapped_column(Integer, default=None)
    meta: Mapped[dict | None] = mapped_column(JSON, default=None)  # browser/system info

    answers: Mapped[list["Answer"]] = relationship("Answer", back_populates="attempt", cascade="all,delete")

class Answer(Base):
    """Answer for a specific question in an attempt."""
    __tablename__ = "answers"
    __table_args__ = (
        UniqueConstraint("attempt_id", "question_id", name="uq_answer_attempt_question"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey("attempts.id", ondelete="CASCADE"), index=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), index=True)
    response: Mapped[dict | list | str | int | None] = mapped_column(JSON, default=None)
    score: Mapped[int | None] = mapped_column(Integer, default=None)

    attempt = relationship("Attempt", back_populates="answers")
