# Online Assessment and Interview Platform

This repository contains:
- backend_api (FastAPI)
- web_frontend (React)

For full integration details, environment variables, validation flows, and troubleshooting, see DEVELOPER_RUNBOOK.md.

## Quick Start (Local Dev)

Backend:
```bash
cd backend_api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with:
# DATABASE_URL
# JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
# APP_CORS_ORIGINS=http://localhost:3000
# BACKEND_BASE_URL=http://localhost:8000
# WEBSOCKET_BASE_URL=ws://localhost:8000
# SITE_URL=http://localhost:3000
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd web_frontend
cp .env.example .env
# Ensure:
# REACT_APP_API_BASE_URL=http://localhost:8000
# REACT_APP_WS_BASE_URL=ws://localhost:8000
# REACT_APP_ENABLE_MOCKS=false
npm install
npm start
```

## Environment Matrix (Dev Defaults)

- REST API base:
  - Backend BACKEND_BASE_URL: http://localhost:8000
  - Frontend REACT_APP_API_BASE_URL: http://localhost:8000

- WebSocket base:
  - Backend WEBSOCKET_BASE_URL: ws://localhost:8000
  - Frontend REACT_APP_WS_BASE_URL: ws://localhost:8000

- CORS:
  - Backend APP_CORS_ORIGINS must include http://localhost:3000

- Database:
  - Backend DATABASE_URL must point to a reachable DB (e.g., Postgres)

- JWT/Secrets:
  - Backend JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

- Optional:
  - Storage: STORAGE_BACKEND=local|s3 (+ LOCAL_* or S3_*)
  - Exports directory: EXPORTS_DIR
  - Email: EMAIL_* (SMTP)
  - Frontend flags: REACT_APP_ENABLE_MOCKS, REACT_APP_BUILD_ENV, REACT_APP_SENTRY_DSN

Protocol guidance:
- Use http + ws in dev; use https + wss in production to avoid mixed-content issues.

See ENVIRONMENT.md and DEVELOPER_RUNBOOK.md for full mapping and details.

## E2E Validation

Key flows to validate end-to-end:

- Auth and role redirects (login -> role home)
- Anti-cheat events (bulk REST + HR live WS)
- Chat (history REST + chat WS)
- File uploads (resume/profile)
- Exports (reports/results)

Use VALIDATION_CHECKLIST.md to track pass/fail and blockers.

## Preview/Ports

- Frontend dev server: http://localhost:3000
- Backend dev server: http://localhost:8000 (WS: ws://localhost:8000)
- Ensure APP_CORS_ORIGINS includes http://localhost:3000 and that the frontend .env points to the backend URLs above.