# End-to-End Validation Checklist

Setup:
- [ ] Backend running on http://localhost:8000; WS at ws://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] CORS allows http://localhost:3000 in APP_CORS_ORIGINS
- [ ] Frontend .env configured with REACT_APP_API_BASE_URL, REACT_APP_WS_BASE_URL

Auth:
- [ ] Login returns JWT
- [ ] /auth/me returns profile
- [ ] Role redirect lands on correct dashboard
- [ ] Refresh flow works (or fails -> logout)

Anti-Cheat:
- [ ] Event buffer flushes to /api/v1/events/bulk
- [ ] HR /ws/hr/live shows incoming events in live monitor
- [ ] Violations displayed in HR UI

Chat:
- [ ] History loads via REST
- [ ] WS /ws/chat delivers realtime messages
- [ ] Messages persisted to history

Files:
- [ ] Upload resume/profile succeeds and file stored (local or s3)
- [ ] Download/preview works where applicable

Exports:
- [ ] HR/Admin export endpoints generate files in EXPORTS_DIR or storage
- [ ] Download link accessible via frontend

Security:
- [ ] WS connections validate token query parameter
- [ ] CORS blocks disallowed origins

Observability (optional):
- [ ] Build env and Sentry DSN set if used
