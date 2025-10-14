# Web Frontend - Online Assessment Platform

This React frontend integrates with the FastAPI backend over REST and WebSockets. It includes authentication, anti-cheat event logging, chat, and HR live monitoring, styled with the Ocean Professional theme.

## Quick Start

1) Copy environment file and install
```bash
cp .env.example .env
npm install
```

2) Ensure backend is running and CORS allows http://localhost:3000
- Backend base: http://localhost:8000
- WebSocket base: ws://localhost:8000

3) Start the app
```bash
npm start
```

## Environment

Copy `.env.example` to `.env` and adjust:

- REACT_APP_API_BASE_URL (default: http://localhost:8000)
- REACT_APP_WS_BASE_URL (default: ws://localhost:8000)
- REACT_APP_ENABLE_MOCKS (default: false)
- Optional: REACT_APP_BUILD_ENV, REACT_APP_SENTRY_DSN

Safe fallbacks exist in `src/config/env.js` to avoid crashes when envs are missing.

Alignment with backend:
- REACT_APP_API_BASE_URL should equal backend BACKEND_BASE_URL
- REACT_APP_WS_BASE_URL should equal backend WEBSOCKET_BASE_URL
- Ensure backend APP_CORS_ORIGINS includes the frontend origin

## API Client

- Location: `src/services/apiClient.js`
- Uses `fetch` with base URL, token injection, and 401 handling via `/api/v1/auth/refresh`. On refresh failure, it clears the token and emits a `auth:logout` event.

## Endpoints

- Location: `src/services/endpoints.js`
- REST paths aligned to backend: auth, admin, hr, candidate, chat, health, events.
- WebSockets helpers exposed in `wsEndpoints`: `/ws/chat`, `/ws/events`, `/ws/hr/live`.

## WebSockets

- Generic client: `src/services/ws.ts`
- Chat: `createChatWS()`, subscribe via `ws.subscribe(handler)` and send using `ws.send({ ... })`
- Events: `createEventsWS()` used by `useEventLogger`
- HR Live: `createHRLiveWS()` used by `useHRLiveMonitor`

Tokens are appended as a `token` query parameter.

## Auth

- `src/context/AuthContext.jsx` manages token, user profile, login/logout/register.
- Listens for global `auth:logout` event when refresh fails.
- `src/routes/index.jsx` guards routes by role.

## Anti-Cheat Event Logger

- Hook: `src/hooks/useEventLogger.ts`
- Buffers events and flushes to `/api/v1/events/bulk` every 3s or at 25 events.
- Streams events over WebSocket when connected.

## Chat

- Service: `src/services/chat.js`
- Loads history via `GET /api/v1/chat/history?channel=...`
- Realtime via `/ws/chat`.

## HR Live Monitor

- Hook: `src/hooks/useHRLiveMonitor.ts` subscribes to `/ws/hr/live` and maintains recent events.

## Theme

- Tokens: `src/theme/tokens.css`
- Global styles: `src/theme/global.css`
- Ocean Professional palette and modern UI conventions with subtle gradients and shadows.

## End-to-End Validation Checklist

Auth + Role Redirects:
- [ ] POST /api/v1/auth/login returns token; profile available at GET /api/v1/auth/me
- [ ] On login, user is redirected to role home (candidate/admin/hr/employee)
- [ ] Refresh flow: 401 triggers refresh; failure logs out

Anti-Cheat Events:
- [ ] Client buffers events and POSTs to /api/v1/events/bulk (or /api/v1/events)
- [ ] HR live monitor receives events via WS /ws/hr/live
- [ ] Violations appear in HR panel live monitor UI

Chat:
- [ ] History via GET /api/v1/chat/threads and /api/v1/chat/threads/:id/messages (or /api/v1/chat/history?channel=)
- [ ] Realtime via WS /ws/chat?room=<room>&token=<jwt>
- [ ] Messages persist to chat history

File Uploads:
- [ ] Resume/profile uploads POST /api/v1/files/upload (or specific endpoints)
- [ ] Files stored according to STORAGE_BACKEND
- [ ] Download and previews work where applicable

Exports:
- [ ] Admin/HR export endpoints produce CSV/PDF (e.g., /api/v1/admin/reports/:id/export or /api/v1/hr/results/export)
- [ ] EXPORTS_DIR or storage backend configured and accessible

WebSocket Security:
- [ ] token query param validated server-side
- [ ] Cross-origin WS allowed for the frontend origin

CORS:
- [ ] APP_CORS_ORIGINS includes http://localhost:3000 (and production origins)

## Missing or Optional Variables to Confirm

Backend:
- [ ] BACKEND_BASE_URL (used in links/emails; aligns with frontend API base)
- [ ] WEBSOCKET_BASE_URL (used by clients to build ws URLs)
- [ ] STORAGE_BACKEND + LOCAL/S3 configuration
- [ ] EXPORTS_DIR path exists and is writable
- [ ] EMAIL_* settings for outbound notifications

Frontend:
- [ ] REACT_APP_API_BASE_URL
- [ ] REACT_APP_WS_BASE_URL
- [ ] REACT_APP_ENABLE_MOCKS
- [ ] REACT_APP_BUILD_ENV (optional)
- [ ] REACT_APP_SENTRY_DSN (optional)
