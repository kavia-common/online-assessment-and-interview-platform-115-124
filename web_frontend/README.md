# Web Frontend - Online Assessment Platform

This React frontend integrates with the FastAPI backend over REST and WebSockets. It includes authentication, anti-cheat event logging, chat, and HR live monitoring, styled with the Ocean Professional theme.

## Environment

Copy `.env.example` to `.env` and adjust:

- `REACT_APP_API_BASE_URL` (default: `http://localhost:8000`)
- `REACT_APP_WS_BASE_URL` (default: `ws://localhost:8000`)
- `REACT_APP_ENABLE_MOCKS` (default: `false`)

Safe fallbacks exist in `src/config/env.js` to avoid crashes when envs are missing.

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

## Development

- Install: `npm install`
- Run: `npm start`
- Backend: ensure FastAPI backend is running with matching API and WS base URLs.

```bash
cp .env.example .env
npm install
npm start
```
