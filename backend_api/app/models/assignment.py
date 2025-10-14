from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Integer, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
import enum

class AssignmentStatus(str, enum.Enum):
    assigned = "assigned"
    started = "started"
    submitted = "submitted"
    evaluated = "evaluated"
    expired = "expired"

class Assignment(Base):
    """Assigns a test template to a candidate with optional reviewer/HR."""
    __tablename__ = "assignments"
    __table_args__ = (
        UniqueConstraint("template_id", "candidate_id", name="uq_assignment_template_candidate"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    template_id: Mapped[int] = mapped_column(ForeignKey("templates.id", ondelete="CASCADE"), index=True)
    candidate_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    assigned_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    reviewer_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    status: Mapped[AssignmentStatus] = mapped_column(Enum(AssignmentStatus), default=AssignmentStatus.assigned, index=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    template = relationship("Template")
    candidate = relationship("User", foreign_keys=[candidate_id])
    assigned_by = relationship("User", foreign_keys=[assigned_by_id])
    reviewer = relationship("User", foreign_keys=[reviewer_id])
