# End-to-End Validation Checklist

Setup:
- [ ] Backend running on http://localhost:8000; WS at ws://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] CORS allows http://localhost:3000 in APP_CORS_ORIGINS
- [ ] Frontend .env configured with REACT_APP_API_BASE_URL, REACT_APP_WS_BASE_URL

Auth:
- [ ] POST /api/v1/auth/login returns JWT (Backend: /auth/login)
- [ ] GET /api/v1/auth/me returns profile (Backend: /auth/me)
- [ ] Role redirect lands on correct dashboard (Frontend route guards)
- [ ] Refresh flow works (or fails -> logout)

Anti-Cheat:
- [ ] Event buffer flushes to /api/v1/events/bulk (Backend: /events/bulk)
- [ ] HR /ws/hr/live shows incoming events in live monitor (Backend: /ws/hr/live)
- [ ] Violations displayed in HR UI

Chat:
- [ ] History loads via REST (Backend: /chat/threads, /chat/threads/:id/messages)
- [ ] WS /ws/chat delivers realtime messages (Backend: /ws/chat?room=..&token=..)
- [ ] Messages persisted to history

Files:
- [ ] Upload resume/profile succeeds and file stored (local or s3) (Backend: /files/upload)
- [ ] Download/preview works where applicable

Exports:
- [ ] HR/Admin export endpoints generate files (e.g., /hr/results/export or /admin/reports/:id/export)
- [ ] Download link accessible via frontend (EXPORTS_DIR or storage)

Security:
- [ ] WS connections validate token query parameter
- [ ] CORS blocks disallowed origins
- [ ] No mixed-content issues (http/ws vs https/wss)

Observability (optional):
- [ ] Build env and Sentry DSN set if used

Notes / Blockers:
- [ ] DATABASE_URL must be configured for backend to run.
- [ ] JWT_SECRET must be set to a non-default value in non-dev environments.
- [ ] If using S3 storage, S3_* variables must be provided and STORAGE_BACKEND=s3.
- [ ] For email flows, EMAIL_* variables and outbound connectivity are required.
