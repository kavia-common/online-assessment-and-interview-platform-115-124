from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Role(Base):
    """Represents a user role, e.g., admin, hr, candidate, employee."""
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(String(255), default=None)

    users: Mapped[list["User"]] = relationship(back_populates="role")

class User(Base):
    """Platform user with role and auth details."""
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    role_id: Mapped[int | None] = mapped_column(ForeignKey("roles.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    role: Mapped["Role"] = relationship(back_populates="users")
    files: Mapped[list["StoredFile"]] = relationship("StoredFile", back_populates="owner")
    resumes: Mapped[list["Resume"]] = relationship("Resume", back_populates="owner")
    chat_threads: Mapped[list["ChatThread"]] = relationship("ChatThread", back_populates="owner")
