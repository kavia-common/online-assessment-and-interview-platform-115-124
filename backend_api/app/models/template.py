from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Integer, Table, Column, JSON, UniqueConstraint, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

# Association table for template -> questions ordering
template_questions = Table(
    "template_questions",
    Base.metadata,
    Column("template_id", ForeignKey("templates.id", ondelete="CASCADE"), primary_key=True),
    Column("question_id", ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True),
    Column("order_index", Integer, nullable=False, default=0),
)

class Template(Base):
    """Test template that references selected questions in order with settings."""
    __tablename__ = "templates"
    __table_args__ = (
        UniqueConstraint("name", name="uq_templates_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, default=None)
    settings: Mapped[dict | None] = mapped_column(JSON, default=None)  # duration, shuffle, negative marking etc.
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    questions = relationship("Question", secondary=template_questions, order_by=template_questions.c.order_index)
