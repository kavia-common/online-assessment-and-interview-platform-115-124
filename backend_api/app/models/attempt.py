from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class AttemptQuestion(Base):
    __tablename__ = "attempt_questions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    attempt_id: Mapped[int] = mapped_column(ForeignKey("test_attempts.id"), index=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"), index=True)
    sequence: Mapped[int] = mapped_column(Integer, default=0)
    exposed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    attempt_question_id: Mapped[int] = mapped_column(ForeignKey("attempt_questions.id"), index=True)
    selected_option_id: Mapped[int | None] = mapped_column(ForeignKey("options.id"), nullable=True)
    answer_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)
    answered_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
