from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
import enum

class FileStorageBackend(str, enum.Enum):
    local = "local"
    s3 = "s3"

class StoredFile(Base):
    """Generic stored file metadata (resume, exports, etc.)."""
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    backend: Mapped[FileStorageBackend] = mapped_column(Enum(FileStorageBackend), default=FileStorageBackend.local)
    storage_path: Mapped[str] = mapped_column(String(500))  # local path or S3 key
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="files")

class Resume(Base):
    """Candidate resumes referencing StoredFile."""
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    file_id: Mapped[int] = mapped_column(ForeignKey("files.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="resumes")
    file = relationship("StoredFile")
