# backend_api

FastAPI backend for the Online Assessment and Interview Platform.

Quick start:
- Create a virtualenv and install requirements.txt
- Copy .env.example to .env and set DATABASE_URL and other values
- Run Alembic migrations: alembic upgrade head
- Seed dev data: python -m app.main (to verify) and python seed/seed_dev.py
- Start dev server (not required by this task): uvicorn app.main:app --reload

CORS
- Defaults to allow http://localhost:3000 via APP_CORS_ORIGINS
