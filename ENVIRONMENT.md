# Environment Variables Reference

This document maps frontend and backend environment variables and where they are used.

## Frontend (web_frontend)

Required:
- REACT_APP_API_BASE_URL: Base URL for REST API (e.g., http://localhost:8000)
- REACT_APP_WS_BASE_URL: Base URL for WebSockets (e.g., ws://localhost:8000)

Optional:
- REACT_APP_ENABLE_MOCKS: "false" to call backend, "true" to use mocks
- REACT_APP_BUILD_ENV: development|staging|production
- REACT_APP_SENTRY_DSN: Sentry DSN

Usage:
- src/config/env.js derives apiBase, wsBase, flags
- src/services/apiClient.js uses apiBase
- src/services/ws.ts uses wsBase
- hooks/useEventLogger.ts uses REST + WS

## Backend (backend_api)

Required:
- DATABASE_URL: SQLAlchemy connection string
- JWT_SECRET: HMAC secret
- JWT_ALGORITHM: HS256 (default)
- ACCESS_TOKEN_EXPIRE_MINUTES: token TTL
- APP_CORS_ORIGINS: comma-separated origins (include frontend origin)
- BACKEND_BASE_URL: canonical external URL for REST (aligns with frontend REACT_APP_API_BASE_URL)
- WEBSOCKET_BASE_URL: canonical external URL for WS (aligns with frontend REACT_APP_WS_BASE_URL)

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

## Alignment Checklist

- REACT_APP_API_BASE_URL == BACKEND_BASE_URL
- REACT_APP_WS_BASE_URL == WEBSOCKET_BASE_URL
- APP_CORS_ORIGINS includes the frontend origin
- Storage and exports paths exist and are writable
- Email configured if email features are tested
