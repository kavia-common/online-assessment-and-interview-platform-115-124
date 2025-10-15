# Developer Runbook — Online Assessment and Interview Platform

This runbook finalizes integration between the React web_frontend and FastAPI backend_api. It documents required environment variables, local connection instructions, end-to-end validation checklist, CORS, and troubleshooting tips.

## Containers Overview

- backend_api: FastAPI app exposing REST and WebSocket endpoints on http://localhost:8000 (ws://localhost:8000).
- web_frontend: React SPA served by the dev server at http://localhost:3000.

Use http+ws in development and https+wss in production to avoid mixed content issues.

---

## 1) Environment Variables

### A) Backend: backend_api/.env

Required
- DATABASE_URL: Full database connection string (e.g., postgresql+psycopg2://user:pass@localhost:5432/oaip_dev)
- JWT_SECRET: Secret for signing JWTs
- JWT_ALGORITHM: Algorithm to sign JWTs (e.g., HS256)
- ACCESS_TOKEN_EXPIRE_MINUTES: Token expiry in minutes (e.g., 60)
- APP_CORS_ORIGINS: Comma-separated list of allowed origins. Include http://localhost:3000 for local dev
- BACKEND_BASE_URL: Base URL of REST API (dev: http://localhost:8000)
- WEBSOCKET_BASE_URL: Base URL of WebSockets (dev: ws://localhost:8000)
- SITE_URL: Frontend base URL (dev: http://localhost:3000)

Optional
- STORAGE_BACKEND: local | s3 (default: local)
  - If local:
    - LOCAL_STORAGE_DIR: Directory for local file storage (e.g., ./storage)
  - If s3:
    - S3_BUCKET
    - S3_REGION
    - S3_ACCESS_KEY_ID
    - S3_SECRET_ACCESS_KEY
    - S3_ENDPOINT (optional)
- EXPORTS_DIR: Directory path for report exports (e.g., ./exports)
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM, EMAIL_USE_TLS: SMTP configuration for outbound email
- LOG_LEVEL: info | debug | warning | error (default: info)

Notes
- Ensure APP_CORS_ORIGINS includes http://localhost:3000 for dev.
- BACKEND_BASE_URL and WEBSOCKET_BASE_URL should match what the frontend uses.
- Provide a reachable DATABASE_URL before running migrations.

### B) Frontend: web_frontend/.env

Required (for integration; defaults exist but set explicitly for clarity)
- REACT_APP_API_BASE_URL: http://localhost:8000
- REACT_APP_WS_BASE_URL: ws://localhost:8000

Recommended
- REACT_APP_ENABLE_MOCKS: false (set to true to develop without backend)
- REACT_APP_BUILD_ENV: development | staging | production
- REACT_APP_SENTRY_DSN: Optional error reporting DSN

Notes
- src/config/env.js derives sane defaults, but explicit .env values are preferred for consistency.
- Do not commit secrets.

---

## 2) Connection Instructions (Local Dev)

Goal: Make web_frontend call backend_api at:
- REST: REACT_APP_API_BASE_URL=http://localhost:8000
- WebSocket: REACT_APP_WS_BASE_URL=ws://localhost:8000

Backend
1) cd online-assessment-and-interview-platform-115-124/backend_api
2) python -m venv .venv && source .venv/bin/activate
3) pip install -r requirements.txt
4) cp .env.example .env (if present) and update the following:
   - DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/oaip_dev
   - JWT_SECRET=devsecret
   - JWT_ALGORITHM=HS256
   - ACCESS_TOKEN_EXPIRE_MINUTES=60
   - APP_CORS_ORIGINS=http://localhost:3000
   - BACKEND_BASE_URL=http://localhost:8000
   - WEBSOCKET_BASE_URL=ws://localhost:8000
   - SITE_URL=http://localhost:3000
5) alembic upgrade head
6) Optional: python seed/seed_dev.py
7) Start: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Frontend
1) cd online-assessment-and-interview-platform-115-124/web_frontend
2) cp .env.example .env (if present) and ensure:
   - REACT_APP_API_BASE_URL=http://localhost:8000
   - REACT_APP_WS_BASE_URL=ws://localhost:8000
   - REACT_APP_ENABLE_MOCKS=false
3) npm install
4) npm start
5) Open http://localhost:3000

---

## 3) Validation Checklist (End-to-End Flows)

Use this to confirm integration is working across auth, events, HR live monitoring, exports, candidate test, and chat (REST+WS).

Auth and Redirects
- [ ] POST /api/v1/auth/login returns access token
- [ ] GET /api/v1/auth/me returns profile when Authorization: Bearer <token>
- [ ] Frontend redirects to role home after login:
      - candidate -> /candidate
      - admin -> /admin
      - hr -> /hr
      - employee -> /employee
- [ ] 401 triggers refresh flow; on failure user is logged out

Event Logging (REST bulk) and HR Live WS Monitor
- [ ] Client buffers events and sends POST /api/v1/events/bulk periodically
- [ ] Events saved in DB; bulk endpoint responds 2xx
- [ ] HR live monitor connects to WS /ws/hr/live?token=<jwt>
- [ ] Live events stream appears in HR panel
- [ ] Violations/alerts surface in UI as expected

HR Export Download
- [ ] Trigger export (e.g., GET /api/v1/hr/results/export or Admin report export)
- [ ] File is generated in EXPORTS_DIR or storage backend and downloads via frontend
- [ ] CSV/PDF contents are correct and not empty

Candidate Test Shell (Countdown, Fullscreen, Anti-Cheat)
- [ ] Launch test: /candidate/test-launcher -> /candidate/test/:testId
- [ ] Fullscreen guard works; exiting fullscreen warns or blocks
- [ ] Countdown timer runs; auto-submit/auto-logout at time expiry
- [ ] Option shuffling works; answer persistence works
- [ ] Anti-cheat: blocks clipboard/context menu; tab visibility/blur tracked; idle detection and beforeunload guard active
- [ ] Event logger captures relevant proctor events and POSTs/streams them

Chat (REST + WS)
- [ ] Load threads via GET /api/v1/chat/threads
- [ ] Load messages via GET /api/v1/chat/threads/:threadId/messages (or equivalent)
- [ ] Connect to WS /ws/chat?room=<room>&token=<jwt>
- [ ] Send/receive messages live; new messages appear in UI and persist

File Uploads (Resume/Profile) — optional but recommended
- [ ] POST /api/v1/files/upload stores file
- [ ] Download/preview where applicable

CORS
- [ ] Backend APP_CORS_ORIGINS includes http://localhost:3000
- [ ] No CORS errors in browser console

---

## 4) CORS Origin

For local development, set:
- APP_CORS_ORIGINS=http://localhost:3000

If multiple origins are needed, provide a comma-separated list (e.g., http://localhost:3000,https://dev.example.com).
Ensure WebSocket cross-origin policy aligns with the same origin list.

---

## 5) Troubleshooting Tips

Authentication
- Symptom: 401 on /auth/me or protected routes
  - Verify Authorization header set by frontend (localStorage token available and apiClient setToken invoked)
  - Confirm JWT_SECRET/JWT_ALGORITHM match backend expectations
  - Check token expiry (ACCESS_TOKEN_EXPIRE_MINUTES)
  - Ensure clock skew is not causing premature expiry

CORS Errors
- Symptom: Browser blocks REST/WS with CORS policy error
  - Confirm APP_CORS_ORIGINS includes http://localhost:3000
  - Restart backend after changing CORS settings
  - Check browser console for exact blocked origin/headers

WebSockets Fail to Connect
- Symptom: WS handshake fails
  - Confirm REACT_APP_WS_BASE_URL=ws://localhost:8000
  - Ensure token query parameter is appended and valid
  - Inspect backend logs for WS auth or path mismatches
  - Mix of https and ws will be blocked; use http+ws for dev

Mixed Content
- Symptom: In production over https, WS fails
  - Use wss for REACT_APP_WS_BASE_URL if frontend served over https
  - Ensure TLS certs are configured for backend

Bulk Events Not Persisting
- Symptom: POST /events/bulk 4xx/5xx
  - Validate request payload schema from useEventLogger.ts
  - Check DB connectivity and migrations applied (alembic upgrade head)
  - Review backend logs (event_logger service) for validation errors

HR Live Monitor Not Updating
- Symptom: Live tile stays empty
  - Confirm WS /ws/hr/live is connected (network tab)
  - Verify events are being published server-side (events router)
  - Check JWT token validity and role permissions

Exports Fail to Download
- Symptom: 404 or empty file
  - Ensure EXPORTS_DIR exists and is writable
  - Confirm backend exporter generates file and sets correct content-type
  - If using S3, verify keys/bucket/permissions

File Uploads Fail
- Symptom: 4xx/5xx on /files/upload
  - Ensure python-multipart installed (already in requirements.txt)
  - Check STORAGE_BACKEND settings and local/S3 paths
  - Validate form-data payload structure in frontend

Frontend Env Not Applied
- Symptom: Frontend still pointing to wrong API base
  - Ensure .env is in web_frontend root (same level as package.json)
  - Restart npm start after .env changes
  - Confirm src/config/env.js resolves correct values (console.log temporarily)

Port Conflicts
- Symptom: Port already in use
  - Frontend dev server default 3000; if busy, react-scripts prompts to use another port—accept or stop conflicting process
  - Backend default 8000; adjust with --port if needed

Database Issues
- Symptom: Connection refused / migration errors
  - Verify DATABASE_URL
  - Ensure Postgres is running and accessible, correct user/password/host
  - Apply migrations: alembic upgrade head

Email Not Sending
- Symptom: Email job stuck or 5xx
  - Verify SMTP configuration (EMAIL_* vars)
  - Test connectivity to SMTP server
  - Check backend logs for authentication errors

---

## Reference: Commands

Backend
- Setup: python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
- Migrate: alembic upgrade head
- Seed: python seed/seed_dev.py
- Run: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Frontend
- Install: npm install
- Run: npm start
- Build: npm run build
- Test: npm test

---

## Notes and Alignment

- Frontend configuration lives in web_frontend/src/config/env.js and is consumed by apiClient.js and ws.ts/websocket.js.
- Backend must validate tokens for both REST and WS; current stubs should be hardened before production.
- Keep BACKEND_BASE_URL == REACT_APP_API_BASE_URL and WEBSOCKET_BASE_URL == REACT_APP_WS_BASE_URL across environments.
- For production, prefer https + wss and configure proper CORS and CSRF/headers according to deployment platform.

---
