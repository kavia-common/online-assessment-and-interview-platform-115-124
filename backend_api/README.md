# backend_api

FastAPI backend for the Online Assessment and Interview Platform.

Routes summary:
/health -> GET basic health
/auth -> POST /login (stub), expand with /register,/refresh,/me as needed
/admin -> admin stubs
/hr -> GET /assignments, GET /results/export
/candidate -> GET /profile
/chat -> GET /threads, GET /threads/{id}/messages
/events -> POST /, POST /bulk, GET /
/files -> POST /upload
/email -> POST /queue, GET /queue/{job_id}

/ws endpoints:
/ws/chat?room=<room>&token=<jwt> - chat adapter
/ws/hr/live?token=<jwt> - HR live monitor

CORS:
- Allowed origins configured via APP_CORS_ORIGINS (.env), default http://localhost:3000

Notes:
- Token validation for websockets checks signature only (stub) and should be hardened.
- Event logging table uses index (session_id, occurred_at) for efficient queries.

## Quick start
1) Create a virtualenv and install requirements.txt
2) Copy .env.example to .env and set DATABASE_URL and other values
3) Run Alembic migrations
4) Seed development data (optional)
5) Start dev server (optional)

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and set:
# - DATABASE_URL
# - JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
# - APP_CORS_ORIGINS (e.g., http://localhost:3000)
# - BACKEND_BASE_URL (e.g., http://localhost:8000)
# - WEBSOCKET_BASE_URL (e.g., ws://localhost:8000)
# - SITE_URL (e.g., http://localhost:3000)

# Run migrations (ensure DB is reachable)
alembic upgrade head

# Seed dev data
python seed/seed_dev.py

# Start dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment
- .env.example is provided with the following placeholders:
  - DATABASE_URL
  - JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
  - APP_CORS_ORIGINS
  - BACKEND_BASE_URL, WEBSOCKET_BASE_URL, SITE_URL
  - STORAGE_BACKEND and storage provider config
  - EMAIL SMTP configuration
  - EXPORTS_DIR

Alignment with frontend:
- The frontend uses:
  - REACT_APP_API_BASE_URL -> should point to BACKEND_BASE_URL (e.g., http://localhost:8000)
  - REACT_APP_WS_BASE_URL -> should point to WEBSOCKET_BASE_URL (e.g., ws://localhost:8000)
- Ensure APP_CORS_ORIGINS includes the frontend origin (e.g., http://localhost:3000)

## Alembic
- alembic.ini configured to resolve script_location and URL is injected from .env via alembic/env.py.
- Autogenerate targets `app.core.db.Base.metadata`.
- Notable indexes:
  - Proctor events: (session_id, occurred_at)
  - Chat messages: (thread_id, created_at)
- To create new migration:
```bash
alembic revision --autogenerate -m "your message"
```

## Seed Data
- script: seed/seed_dev.py
- Seeds roles (admin/hr/candidate/employee), sample users, two questions, one template, one assignment and attempt, proctor events and chat messages.
- Default password for all dev users: "password"

## Notes
- Do not commit real secrets to the repository.
- Ensure Postgres is running and DATABASE_URL is correct.
- CORS defaults to allow http://localhost:3000 via APP_CORS_ORIGINS.
