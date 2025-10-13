from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Template(Base):
    __tablename__ = "templates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    sections: Mapped[list["TemplateSection"]] = relationship(
        "TemplateSection", back_populates="template", cascade="all, delete-orphan"
    )

class TemplateSection(Base):
    __tablename__ = "template_sections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    template_id: Mapped[int] = mapped_column(ForeignKey("templates.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    question_type: Mapped[str] = mapped_column(String(20))  # mcq | theory
    num_questions: Mapped[int] = mapped_column(Integer, default=10)
    marks_per_question: Mapped[int] = mapped_column(Integer, default=1)

    template: Mapped["Template"] = relationship("Template", back_populates="sections")
