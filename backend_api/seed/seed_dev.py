"""
Seed minimal development data:
- Roles: admin, hr, candidate, employee
- Users for each role with default password 'password'
- Questions: 1 MCQ, 1 Theory
- Template with both questions
- Assignment for candidate
- Attempt in_progress with empty answers
- Proctor events, Chat thread and messages
Run:
    python seed/seed_dev.py
Requires:
    - .env with DATABASE_URL
"""
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import SessionLocal, Base, engine
from passlib.context import CryptContext

from app.models.user import Role, User
from app.models.question import Question, QuestionType
from app.models.template import Template, template_questions
from app.models.assignment import Assignment, AssignmentStatus
from app.models.attempt import Attempt, AttemptStatus, Answer
from app.models.proctor_event import ProctorEvent
from app.models.chat import ChatThread, ChatMessage

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pw: str) -> str:
    return pwd_context.hash(pw)

def get_or_create(db: Session, model, defaults=None, **kwargs):
    instance = db.scalar(select(model).filter_by(**kwargs))
    if instance:
        return instance, False
    params = dict(**kwargs)
    if defaults:
        params.update(defaults)
    instance = model(**params)
    db.add(instance)
    db.commit()
    db.refresh(instance)
    return instance, True

def main():
    # Ensure tables exist (for dev convenience)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Roles
        admin_role, _ = get_or_create(db, Role, name="admin")
        hr_role, _ = get_or_create(db, Role, name="hr")
        candidate_role, _ = get_or_create(db, Role, name="candidate")
        employee_role, _ = get_or_create(db, Role, name="employee")

        # Users
        admin, _ = get_or_create(db, User, email="admin@example.com", defaults={
            "full_name": "Admin User", "hashed_password": hash_password("password"), "role_id": admin_role.id
        })
        hr, _ = get_or_create(db, User, email="hr@example.com", defaults={
            "full_name": "HR User", "hashed_password": hash_password("password"), "role_id": hr_role.id
        })
        employee, _ = get_or_create(db, User, email="employee@example.com", defaults={
            "full_name": "Employee User", "hashed_password": hash_password("password"), "role_id": employee_role.id
        })
        candidate, _ = get_or_create(db, User, email="candidate@example.com", defaults={
            "full_name": "Candidate User", "hashed_password": hash_password("password"), "role_id": candidate_role.id
        })

        # Questions
        q1, _ = get_or_create(db, Question, title="What is 2 + 2?", defaults={
            "type": QuestionType.mcq, "content": "Select the correct answer",
            "options": ["3", "4", "5", "22"], "answer_key": 1, "marks": 1, "tags": ["math", "easy"]
        })
        q2, _ = get_or_create(db, Question, title="Explain polymorphism.", defaults={
            "type": QuestionType.theory, "content": "Provide a brief explanation of polymorphism in OOP.",
            "options": None, "answer_key": None, "marks": 5, "tags": ["cs", "oop"]
        })

        # Template
        template, created_template = get_or_create(db, Template, name="Sample Test", defaults={
            "description": "A test with 1 MCQ and 1 Theory",
            "settings": {"duration_min": 20, "shuffle": True}
        })
        if created_template:
            # Link questions with order
            db.execute(template_questions.insert().values([
                {"template_id": template.id, "question_id": q1.id, "order_index": 0},
                {"template_id": template.id, "question_id": q2.id, "order_index": 1},
            ]))
            db.commit()

        # Assignment
        assignment, _ = get_or_create(db, Assignment, template_id=template.id, candidate_id=candidate.id, defaults={
            "assigned_by_id": hr.id, "reviewer_id": employee.id, "status": AssignmentStatus.assigned
        })

        # Attempt
        attempt, created_attempt = get_or_create(db, Attempt, assignment_id=assignment.id, candidate_id=candidate.id, defaults={
            "status": AttemptStatus.in_progress,
            "meta": {"browser": "Chrome", "os": "Linux"}
        })
        if created_attempt:
            db.add_all([
                Answer(attempt_id=attempt.id, question_id=q1.id, response=None, score=None),
                Answer(attempt_id=attempt.id, question_id=q2.id, response=None, score=None),
            ])
            db.commit()

        # Proctor events
        db.add_all([
            ProctorEvent(attempt_id=attempt.id, session_id="sess-123", event_type="focus", payload={"state": "blur"}),
            ProctorEvent(attempt_id=attempt.id, session_id="sess-123", event_type="fullscreen", payload={"enabled": True}),
        ])
        db.commit()

        # Chat thread and messages
        thread, created_thread = get_or_create(db, ChatThread, channel="hr", owner_id=candidate.id)
        if created_thread:
            db.add_all([
                ChatMessage(thread_id=thread.id, sender_id=candidate.id, content="Hello HR, I have a question."),
                ChatMessage(thread_id=thread.id, sender_id=hr.id, content="Hi! How can I help you?"),
            ])
            db.commit()

        print("Seed complete.")
    except Exception as e:
        db.rollback()
        print("Seed failed:", e)
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
