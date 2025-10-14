from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base

class HRConfig(Base):
    """HR configuration for patterns, time adjustments, and reappear rules."""
    __tablename__ = "hr_configs"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[dict] = mapped_column(JSON)
