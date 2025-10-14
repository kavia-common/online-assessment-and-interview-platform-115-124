from datetime import datetime
from sqlalchemy import String, DateTime, Enum, Integer, JSON, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base
import enum

class QuestionType(str, enum.Enum):
    mcq = "mcq"
    theory = "theory"

class Question(Base):
    """Bank of questions supporting MCQ and Theory."""
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[QuestionType] = mapped_column(Enum(QuestionType), index=True)
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text)  # problem statement / question text
    # For MCQ: options is list[str], answer_key is list[int] or int; for theory: rubric hints
    options: Mapped[list[str] | None] = mapped_column(JSON, default=None)
    answer_key: Mapped[list[int] | int | None] = mapped_column(JSON, default=None)
    marks: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    tags: Mapped[list[str] | None] = mapped_column(JSON, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
