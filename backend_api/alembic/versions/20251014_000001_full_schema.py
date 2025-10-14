"""full schema for users/roles, questions, templates/tests, assignments, attempts/answers,
proctor_events, interviews, hr_config, files/resumes, chat threads/messages, email jobs.

Revision ID: 20251014_000001
Revises: 20251013_000001
Create Date: 2025-10-14 00:00:01.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20251014_000001"
down_revision: Union[str, None] = "20251013_000001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # roles
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("description", sa.String(length=255)),
    )
    op.create_index("ix_roles_id", "roles", ["id"])
    op.create_index("ix_roles_name", "roles", ["name"], unique=True)

    # users
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255)),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.id", ondelete="SET NULL")),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"])

    # questions
    question_type = sa.Enum("mcq", "theory", name="questiontype")
    question_type.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("type", question_type, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("options", sa.JSON(), nullable=True),
        sa.Column("answer_key", sa.JSON(), nullable=True),
        sa.Column("marks", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_questions_type", "questions", ["type"])

    # templates
    op.create_table(
        "templates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("settings", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
        sa.UniqueConstraint("name", name="uq_templates_name"),
    )

    # template_questions
    op.create_table(
        "template_questions",
        sa.Column("template_id", sa.Integer(), sa.ForeignKey("templates.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("question_id", sa.Integer(), sa.ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
    )

    # assignments
    assignment_status = sa.Enum("assigned", "started", "submitted", "evaluated", "expired", name="assignmentstatus")
    assignment_status.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "assignments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("template_id", sa.Integer(), sa.ForeignKey("templates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("candidate_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("assigned_by_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("reviewer_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("status", assignment_status, nullable=False, server_default="assigned"),
        sa.Column("due_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.UniqueConstraint("template_id", "candidate_id", name="uq_assignment_template_candidate"),
    )
    op.create_index("ix_assignments_template_id", "assignments", ["template_id"])
    op.create_index("ix_assignments_candidate_id", "assignments", ["candidate_id"])
    op.create_index("ix_assignments_status", "assignments", ["status"])

    # attempts
    attempt_status = sa.Enum("in_progress", "submitted", "graded", "canceled", name="attemptstatus")
    attempt_status.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "attempts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("assignment_id", sa.Integer(), sa.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("candidate_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("started_at", sa.DateTime(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(), nullable=True),
        sa.Column("duration_sec", sa.Integer(), nullable=True),
        sa.Column("status", attempt_status, nullable=False, server_default="in_progress"),
        sa.Column("total_score", sa.Integer(), nullable=True),
        sa.Column("meta", sa.JSON(), nullable=True),
        sa.UniqueConstraint("assignment_id", "candidate_id", name="uq_attempt_assignment_candidate"),
    )
    op.create_index("ix_attempts_assignment_id", "attempts", ["assignment_id"])
    op.create_index("ix_attempts_candidate_id", "attempts", ["candidate_id"])
    op.create_index("ix_attempts_status", "attempts", ["status"])

    # answers
    op.create_table(
        "answers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("attempt_id", sa.Integer(), sa.ForeignKey("attempts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", sa.Integer(), sa.ForeignKey("questions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("response", sa.JSON(), nullable=True),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.UniqueConstraint("attempt_id", "question_id", name="uq_answer_attempt_question"),
    )
    op.create_index("ix_answers_attempt_id", "answers", ["attempt_id"])
    op.create_index("ix_answers_question_id", "answers", ["question_id"])

    # proctor_events
    op.create_table(
        "proctor_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("attempt_id", sa.Integer(), sa.ForeignKey("attempts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("session_id", sa.String(length=64), nullable=False),
        sa.Column("event_type", sa.String(length=64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=True),
        sa.Column("occurred_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_proctor_events_attempt_id", "proctor_events", ["attempt_id"])
    op.create_index("ix_proctor_events_session_id", "proctor_events", ["session_id"])
    op.create_index("ix_proctor_events_event_type", "proctor_events", ["event_type"])
    op.create_index("ix_proctor_events_occurred_at", "proctor_events", ["occurred_at"])
    op.create_index("ix_proctor_events_session_time", "proctor_events", ["session_id", "occurred_at"])

    # interviews
    op.create_table(
        "interviews",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("interviewer_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("scheduled_at", sa.DateTime(), nullable=False),
        sa.Column("duration_min", sa.Integer(), nullable=False, server_default="30"),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
    )
    op.create_index("ix_interviews_candidate_id", "interviews", ["candidate_id"])
    op.create_index("ix_interviews_interviewer_id", "interviews", ["interviewer_id"])

    # hr_configs
    op.create_table(
        "hr_configs",
        sa.Column("key", sa.String(length=100), primary_key=True),
        sa.Column("value", sa.JSON(), nullable=False),
    )

    # files
    filestorage = sa.Enum("local", "s3", name="filestoragebackend")
    filestorage.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "files",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=100), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("backend", filestorage, nullable=False, server_default="local"),
        sa.Column("storage_path", sa.String(length=500), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_files_owner_id", "files", ["owner_id"])

    # resumes
    op.create_table(
        "resumes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("file_id", sa.Integer(), sa.ForeignKey("files.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_resumes_owner_id", "resumes", ["owner_id"])
    op.create_index("ix_resumes_file_id", "resumes", ["file_id"])

    # chat_threads
    op.create_table(
        "chat_threads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("channel", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_chat_threads_owner_id", "chat_threads", ["owner_id"])
    op.create_index("ix_chat_threads_channel", "chat_threads", ["channel"])

    # chat_messages
    op.create_table(
        "chat_messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("thread_id", sa.Integer(), sa.ForeignKey("chat_threads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sender_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_chat_messages_thread_id", "chat_messages", ["thread_id"])
    op.create_index("ix_chat_messages_sender_id", "chat_messages", ["sender_id"])
    op.create_index("ix_chat_messages_created_at", "chat_messages", ["created_at"])
    op.create_index("ix_chat_messages_thread_time", "chat_messages", ["thread_id", "created_at"])

    # email_jobs
    email_status = sa.Enum("queued", "sending", "sent", "failed", name="emailstatus")
    email_status.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "email_jobs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("to_address", sa.String(length=255), nullable=False),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("template", sa.String(length=100), nullable=True),
        sa.Column("payload", sa.JSON(), nullable=True),
        sa.Column("status", email_status, nullable=False, server_default="queued"),
        sa.Column("attempt_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_error", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_email_jobs_status", "email_jobs", ["status"])

def downgrade() -> None:
    # drop in reverse order respecting FKs and enums
    op.drop_index("ix_email_jobs_status", table_name="email_jobs")
    op.drop_table("email_jobs")

    op.drop_index("ix_chat_messages_thread_time", table_name="chat_messages")
    op.drop_index("ix_chat_messages_created_at", table_name="chat_messages")
    op.drop_index("ix_chat_messages_sender_id", table_name="chat_messages")
    op.drop_index("ix_chat_messages_thread_id", table_name="chat_messages")
    op.drop_table("chat_messages")

    op.drop_index("ix_chat_threads_channel", table_name="chat_threads")
    op.drop_index("ix_chat_threads_owner_id", table_name="chat_threads")
    op.drop_table("chat_threads")

    op.drop_index("ix_resumes_file_id", table_name="resumes")
    op.drop_index("ix_resumes_owner_id", table_name="resumes")
    op.drop_table("resumes")

    op.drop_index("ix_files_owner_id", table_name="files")
    op.drop_table("files")
    sa.Enum(name="filestoragebackend").drop(op.get_bind(), checkfirst=True)

    op.drop_table("hr_configs")

    op.drop_index("ix_interviews_interviewer_id", table_name="interviews")
    op.drop_index("ix_interviews_candidate_id", table_name="interviews")
    op.drop_table("interviews")

    op.drop_index("ix_proctor_events_session_time", table_name="proctor_events")
    op.drop_index("ix_proctor_events_occurred_at", table_name="proctor_events")
    op.drop_index("ix_proctor_events_event_type", table_name="proctor_events")
    op.drop_index("ix_proctor_events_session_id", table_name="proctor_events")
    op.drop_index("ix_proctor_events_attempt_id", table_name="proctor_events")
    op.drop_table("proctor_events")

    op.drop_index("ix_answers_question_id", table_name="answers")
    op.drop_index("ix_answers_attempt_id", table_name="answers")
    op.drop_table("answers")

    op.drop_index("ix_attempts_status", table_name="attempts")
    op.drop_index("ix_attempts_candidate_id", table_name="attempts")
    op.drop_index("ix_attempts_assignment_id", table_name="attempts")
    op.drop_table("attempts")
    sa.Enum(name="attemptstatus").drop(op.get_bind(), checkfirst=True)

    op.drop_index("ix_assignments_status", table_name="assignments")
    op.drop_index("ix_assignments_candidate_id", table_name="assignments")
    op.drop_index("ix_assignments_template_id", table_name="assignments")
    op.drop_table("assignments")
    sa.Enum(name="assignmentstatus").drop(op.get_bind(), checkfirst=True)

    op.drop_table("template_questions")
    op.drop_table("templates")

    op.drop_index("ix_questions_type", table_name="questions")
    op.drop_table("questions")
    sa.Enum(name="questiontype").drop(op.get_bind(), checkfirst=True)

    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")

    op.drop_index("ix_roles_name", table_name="roles")
    op.drop_index("ix_roles_id", table_name="roles")
    op.drop_table("roles")
