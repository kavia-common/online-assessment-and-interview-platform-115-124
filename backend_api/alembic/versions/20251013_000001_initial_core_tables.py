"""initial core tables

Revision ID: 20251013_000001
Revises:
Create Date: 2025-10-13 00:00:01.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20251013_000001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table('roles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=50), nullable=False, unique=True, index=True),
        sa.Column('description', sa.String(length=255), nullable=True),
    )
    op.create_table('users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.sql.expression.true()),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role_id', sa.Integer(), sa.ForeignKey('roles.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )
    op.create_table('questions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('type', sa.String(length=20), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('difficulty', sa.Integer(), nullable=False, server_default="1"),
        sa.Column('tags', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.sql.expression.true()),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_table('options',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('question_id', sa.Integer(), sa.ForeignKey('questions.id')),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('is_correct', sa.Boolean(), nullable=False, server_default=sa.sql.expression.false()),
    )
    op.create_table('templates',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False, unique=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default="60"),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_table('template_sections',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('templates.id')),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('question_type', sa.String(length=20), nullable=False),
        sa.Column('num_questions', sa.Integer(), nullable=False),
        sa.Column('marks_per_question', sa.Integer(), nullable=False),
    )
    op.create_table('test_assignments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('candidate_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('templates.id')),
        sa.Column('status', sa.String(length=50), nullable=False, server_default="assigned"),
        sa.Column('scheduled_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_table('test_attempts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('assignment_id', sa.Integer(), sa.ForeignKey('test_assignments.id')),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=True),
        sa.Column('duration_seconds', sa.Integer(), nullable=True),
        sa.Column('score', sa.Integer(), nullable=True),
    )
    op.create_table('attempt_questions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id')),
        sa.Column('question_id', sa.Integer(), sa.ForeignKey('questions.id')),
        sa.Column('sequence', sa.Integer(), nullable=False, server_default="0"),
        sa.Column('exposed_at', sa.DateTime(), nullable=True),
    )
    op.create_table('attempt_answers',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('attempt_question_id', sa.Integer(), sa.ForeignKey('attempt_questions.id')),
        sa.Column('selected_option_id', sa.Integer(), sa.ForeignKey('options.id'), nullable=True),
        sa.Column('answer_text', sa.Text(), nullable=True),
        sa.Column('is_flagged', sa.Boolean(), nullable=False, server_default=sa.sql.expression.false()),
        sa.Column('answered_at', sa.DateTime(), nullable=True),
    )
    op.create_table('proctor_events',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id'), nullable=True),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('metadata', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_table('interviews',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('candidate_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('interviewer_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('scheduled_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default="scheduled"),
        sa.Column('notes', sa.Text(), nullable=True),
    )
    op.create_table('chat_threads',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=True),
        sa.Column('created_by', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_table('chat_messages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('thread_id', sa.Integer(), sa.ForeignKey('chat_threads.id')),
        sa.Column('sender_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
    )
    op.create_table('hr_configs',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('key', sa.String(length=100), nullable=False, unique=True),
        sa.Column('value', sa.String(length=500), nullable=True),
        sa.Column('enabled', sa.Boolean(), nullable=False, server_default=sa.sql.expression.true()),
    )
    op.create_table('email_jobs',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('to_email', sa.String(length=255), nullable=False),
        sa.Column('subject', sa.String(length=255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column('scheduled_at', sa.DateTime(), nullable=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('error', sa.Text(), nullable=True),
    )
    op.create_table('files',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('path', sa.String(length=500), nullable=False),
        sa.Column('backend', sa.String(length=20), nullable=False, server_default="local"),
        sa.Column('content_type', sa.String(length=100), nullable=True),
        sa.Column('size_bytes', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

def downgrade() -> None:
    op.drop_table('files')
    op.drop_table('email_jobs')
    op.drop_table('hr_configs')
    op.drop_table('chat_messages')
    op.drop_table('chat_threads')
    op.drop_table('interviews')
    op.drop_table('proctor_events')
    op.drop_table('attempt_answers')
    op.drop_table('attempt_questions')
    op.drop_table('test_attempts')
    op.drop_table('test_assignments')
    op.drop_table('template_sections')
    op.drop_table('templates')
    op.drop_table('options')
    op.drop_table('questions')
    op.drop_table('users')
    op.drop_table('roles')
