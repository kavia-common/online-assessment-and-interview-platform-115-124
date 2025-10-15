# Environment Variables Reference

This document maps frontend and backend environment variables, confirms parity, and highlights where they are used. For step-by-step integration, validation, and troubleshooting, see DEVELOPER_RUNBOOK.md.

## Frontend (web_frontend)

Required:
- REACT_APP_API_BASE_URL: Base URL for REST API (dev: http://localhost:8000)
- REACT_APP_WS_BASE_URL: Base URL for WebSockets (dev: ws://localhost:8000)

Optional:
- REACT_APP_ENABLE_MOCKS: "false" to call backend, "true" to use mocks
- REACT_APP_BUILD_ENV: development|staging|production
- REACT_APP_SENTRY_DSN: Sentry DSN

Usage:
- src/config/env.js provides { API_BASE_URL, WS_BASE_URL, ENABLE_MOCKS }
- src/services/apiClient.js uses API_BASE_URL for REST calls
- src/services/ws.ts uses WS_BASE_URL to build ws URLs
- hooks/useEventLogger.ts uses REST + WS

## Backend (backend_api)

Required:
- DATABASE_URL: SQLAlchemy connection string
- JWT_SECRET: HMAC secret
- JWT_ALGORITHM: HS256 (default)
- ACCESS_TOKEN_EXPIRE_MINUTES: token TTL
- APP_CORS_ORIGINS: comma-separated origins (include frontend origin; dev: http://localhost:3000)
- BACKEND_BASE_URL: canonical external URL for REST (aligns with frontend REACT_APP_API_BASE_URL; dev: http://localhost:8000)
- WEBSOCKET_BASE_URL: canonical external URL for WS (aligns with frontend REACT_APP_WS_BASE_URL; dev: ws://localhost:8000)

Recommended:
- SITE_URL: Frontend URL used in templates/emails
- LOG_LEVEL: INFO|DEBUG|WARNING

Storage:
- STORAGE_BACKEND: local|s3
- LOCAL_STORAGE_DIR: path (when local)
- S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT_URL: when s3

Exports:
- EXPORTS_DIR: path for generated reports

Email:
- EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD
- EMAIL_FROM
- EMAIL_TLS, EMAIL_SSL

WebSockets:
- WS endpoints expect token=<jwt> query param

## Environment Parity Matrix

- REST API base
  - Frontend: REACT_APP_API_BASE_URL
  - Backend: BACKEND_BASE_URL
  - Default Dev Value: http://localhost:8000
  - Status: Aligned

- WebSocket base
  - Frontend: REACT_APP_WS_BASE_URL
  - Backend: WEBSOCKET_BASE_URL
  - Default Dev Value: ws://localhost:8000
  - Status: Aligned

- CORS origins
  - Backend: APP_CORS_ORIGINS
  - Must include: http://localhost:3000 (and any deployed frontend origins)
  - Status: Configured by default

- Database
  - Backend: DATABASE_URL
  - Required for API startup/migrations
  - Status: Present in .env.example (must be set in local .env)

- JWT/Secrets
  - Backend: JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
  - Status: Present in .env.example (must be set securely in non-dev)

- Optional subsystems
  - Storage: STORAGE_BACKEND + provider-specific
  - Exports: EXPORTS_DIR
  - Email: EMAIL_* (SMTP)
  - Status: Provided as optional; required only if features are used

- Mixed-content (http/ws vs https/wss)
  - Guidance: Use https + wss in production; in dev http + ws is fine
  - Status: Documented; ensure matching schemes

## Alignment Checklist

- REACT_APP_API_BASE_URL == BACKEND_BASE_URL
- REACT_APP_WS_BASE_URL == WEBSOCKET_BASE_URL
- APP_CORS_ORIGINS includes the frontend origin (http://localhost:3000 in dev)
- Storage and exports paths exist and are writable
- Email configured if email features are tested
- Protocols match (http<->ws, https<->wss) to avoid mixed-content issues
