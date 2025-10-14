# Online Assessment and Interview Platform

This repository contains:
- backend_api (FastAPI)
- web_frontend (React)

## Quick Start (Local Dev)

Backend:
```bash
cd backend_api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with DATABASE_URL, JWT_SECRET, APP_CORS_ORIGINS=http://localhost:3000, BACKEND_BASE_URL=http://localhost:8000, WEBSOCKET_BASE_URL=ws://localhost:8000
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd web_frontend
cp .env.example .env
# Ensure REACT_APP_API_BASE_URL=http://localhost:8000 and REACT_APP_WS_BASE_URL=ws://localhost:8000
npm install
npm start
```

## URL Alignment

- REST API base:
  - Backend BACKEND_BASE_URL -> http://localhost:8000
  - Frontend REACT_APP_API_BASE_URL -> http://localhost:8000

- WebSocket base:
  - Backend WEBSOCKET_BASE_URL -> ws://localhost:8000
  - Frontend REACT_APP_WS_BASE_URL -> ws://localhost:8000

- CORS:
  - Backend APP_CORS_ORIGINS must include http://localhost:3000

## Validate Flows

- Auth and role redirects (login -> role home)
- Anti-cheat events (bulk REST + HR live WS)
- Chat (history REST + chat WS)
- File uploads (resume/profile)
- Exports (reports/results)