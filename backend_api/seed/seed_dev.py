"""
Seed development database with basic roles, an admin user, sample questions, a template, and one assignment.

Usage:
    - Ensure .env has DATABASE_URL configured and dependencies installed.
    - Run as a module or with: python seed/seed_dev.py
"""
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timedelta
from app.core.db import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.question import Question, Option
from app.models.template import Template, TemplateSection
from app.models.assignment import TestAssignment

def get_or_create_role(db: Session, name: str, description: str = "") -> Role:
    role = db.scalar(select(Role).where(Role.name == name))
    if role:
        return role
    role = Role(name=name, description=description)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def get_or_create_user(db: Session, email: str, password: str, full_name: str, role: Role) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user:
        return user
    user = User(
        email=email,
        full_name=full_name,
        is_active=True,
        hashed_password=get_password_hash(password),
        role_id=role.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_sample_questions(db: Session) -> list[Question]:
    existing = db.scalars(select(Question)).all()
    if existing:
        return existing
    q1 = Question(type="mcq", text="What is 2 + 2?", difficulty=1, tags="math")
    q1.options = [
        Option(text="3", is_correct=False),
        Option(text="4", is_correct=True),
        Option(text="5", is_correct=False),
    ]
    q2 = Question(type="theory", text="Explain polymorphism in OOP.", difficulty=2, tags="cs")
    db.add_all([q1, q2])
    db.commit()
    return [q1, q2]

def create_template(db: Session, name: str = "General Aptitude Test") -> Template:
    tmpl = db.scalar(select(Template).where(Template.name == name))
    if tmpl:
        return tmpl
    tmpl = Template(name=name, description="Sample template", duration_minutes=30)
    tmpl.sections = [
        TemplateSection(title="MCQ Section", question_type="mcq", num_questions=1, marks_per_question=1),
        TemplateSection(title="Theory Section", question_type="theory", num_questions=1, marks_per_question=5),
    ]
    db.add(tmpl)
    db.commit()
    db.refresh(tmpl)
    return tmpl

def create_assignment(db: Session, candidate: User, template: Template) -> TestAssignment:
    assignment = TestAssignment(
        candidate_id=candidate.id,
        template_id=template.id,
        status="assigned",
        scheduled_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=7),
        created_at=datetime.utcnow(),
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

def main():
    # Ensure tables exist (in case migrations not applied in dev)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Roles
        admin_role = get_or_create_role(db, "admin", "Administrator")
        hr_role = get_or_create_role(db, "hr", "Human Resources")
        employee_role = get_or_create_role(db, "employee", "Employee")
        candidate_role = get_or_create_role(db, "candidate", "Candidate")

        # Admin user
        admin = get_or_create_user(db, "admin@example.com", "admin123", "Admin User", admin_role)

        # Candidate user
        candidate = get_or_create_user(db, "candidate@example.com", "candidate123", "Candidate One", candidate_role)

        # Sample questions
        create_sample_questions(db)

        # Template
        tmpl = create_template(db)

        # Assignment
        create_assignment(db, candidate, tmpl)

        print("Seed data inserted successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
