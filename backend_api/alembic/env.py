from __future__ import with_statement
from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config, pool
from alembic import context

# Import app settings and Base metadata
from app.core.config import settings
from app.core.db import Base

# Import all models so Alembic can discover tables
# Ensure these imports match actual model files
from app.models.user import User, Role  # noqa: F401
from app.models.question import Question  # noqa: F401
from app.models.template import Template, template_questions  # noqa: F401
from app.models.assignment import Assignment  # noqa: F401
from app.models.attempt import Attempt, Answer  # noqa: F401
from app.models.proctor_event import ProctorEvent  # noqa: F401
from app.models.interview import Interview  # noqa: F401
from app.models.chat import ChatThread, ChatMessage  # noqa: F401
from app.models.hr_config import HRConfig  # noqa: F401
from app.models.email_job import EmailJob  # noqa: F401
from app.models.file import StoredFile, Resume  # noqa: F401

# Alembic Config object, which provides access to values within the .ini file.
config = context.config

# Override URL from env settings (prefer env var, fallback to settings)
db_url = os.getenv("DATABASE_URL", settings.DATABASE_URL)
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    if not url:
        raise RuntimeError("DATABASE_URL must be set for offline migrations.")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
