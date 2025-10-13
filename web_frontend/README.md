# Web Frontend

This is the React single-page application (SPA) for the Online Assessment and Interview Platform. It provides role-based dashboards and workflows for Candidates, Admin, HR, and Employees, including test-taking with anti-cheat guards, question management, HR operations, and employee reviews/chat. The frontend is designed as a single container and assumes a separate backend_api exposing REST and WebSocket endpoints.

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API base URL (if not using mocks)

### Installation
- npm install

### Environment Configuration
Environment variables are read by src/config/env.js via the getEnv() helper. Values should be set in a .env file located at the web_frontend project root (same directory as package.json). See .env.example for a complete reference.

- REACT_APP_API_BASE_URL: Base URL for REST API (e.g., http://localhost:4000)
- REACT_APP_WS_BASE_URL: Base URL for WebSocket (e.g., ws://localhost:4000)
- REACT_APP_ENABLE_MOCKS: "true" to use in-frontend mocked responses; "false" to call the backend
- REACT_APP_BUILD_ENV: Build environment identifier (development, staging, production)
- REACT_APP_SENTRY_DSN: Optional Sentry DSN for error reporting

How env.js reads variables:
- src/config/env.js defines getEnv() which reads process.env values and applies sane defaults:
  - apiBase defaults to http://localhost:4000
  - wsBase defaults to apiBase protocol converted to ws/wss
  - enableMocks defaults to true
  - sentryDsn defaults to empty string
  - buildEnv defaults to development
- apiClient and websocket utilities import getEnv() to determine behavior:
  - src/services/apiClient.js uses apiBase and enableMocks
  - src/services/websocket.js uses wsBase for establishing WS URLs
- Place your project-specific values in web_frontend/.env and never commit secrets.

### Scripts
- npm start: Start the development server
- npm run build: Create a production build
- npm test: Run tests (Jest via react-scripts)

Preview usage note:
- The app will start at http://localhost:3000 by default.
- Initial navigation defaults to /login. After login, role-based routes redirect based on user role.

## Architecture Summary

- Framework: React 18 with react-router-dom v6.
- Container: Single SPA served as static assets, depending on backend_api for data.
- Configuration: src/config/env.js provides environment access with defaults.
- API Layer: src/services/apiClient.js centralizes HTTP requests and mock behavior; src/services/endpoints.js defines REST endpoint paths.
- WebSocket Layer: src/services/websocket.js creates live connections using wsBase and offers a minimal chat adapter.
- Auth: src/context/AuthContext.jsx manages auth state and token sync with apiClient.setToken; src/components/routing/PrivateRoute.jsx and RoleRoute.jsx gate access.
- Layout: Role-specific layouts under src/layouts/* and pages under src/pages/*.
- Anti-cheat and test flow: Components under src/components/test/* and pages/candidate/* implement guards and test runner UX.
- Styling: Global CSS under src/theme/global.css and tokens under src/theme/tokens.css aligned with Ocean Professional theme.

## Role-Based Navigation and Routing

- Role home mapping (src/utils/roleRoutes.js):
  - candidate: /candidate
  - admin: /admin
  - hr: /hr
  - employee: /employee

- Routes (src/routes/index.jsx):
  - Public: /login, /register, /forgot-password
  - Admin (Private + RoleRoute "admin"):
    - /admin, /admin/users, /admin/reports
    - /admin/tests, /admin/tests/new, /admin/tests/:templateId
    - /admin/questions, /admin/questions/new, /admin/questions/:questionId, /admin/questions/import-export
    - /admin/maintenance
  - HR (Private + RoleRoute "hr"):
    - /hr, /hr/assign, /hr/assignment, /hr/bulk-upload, /hr/email-triggers, /hr/export
    - /hr/filters, /hr/live-monitor, /hr/pattern-config, /hr/reappear-requests
    - /hr/results, /hr/test-config, /hr/time-adjustment
  - Candidate (Private + RoleRoute "candidate"):
    - /candidate, /candidate/profile, /candidate/resume, /candidate/questionnaire
    - /candidate/test-launcher, /candidate/test/:testId, /candidate/test/:testId/summary
    - /candidate/interviews, /candidate/interviews/:interviewId
  - Employee (Private + RoleRoute "employee"):
    - /employee, /employee/reviews, /employee/reviews/:reviewId
    - /employee/interviews, /employee/chat
  - Default: any path redirects to /login

## Features

- Candidate:
  - Profile editing, resume upload, questionnaires
  - Test launcher and runner with fullscreen, anti-cheat guards, option shuffling, countdown, and submission summary
  - Interview listing and details
- Admin:
  - Question bank CRUD, import/export, test templates, user management, reports, maintenance
- HR:
  - Test configuration, pattern configuration, bulk upload, email triggers, live monitor, reappears, results (filter/export), time adjustments, assignments
- Employee:
  - Reviews management, interview participation, and chat (WS adapter ready)
- Common:
  - Reusable components (cards, tables, forms, modals, toasts, charts, etc.)

## Environment and Configuration Details

- .env location: Place a .env file in web_frontend/ (root of this package).
- env.js (src/config/env.js):
  - getEnv() returns { apiBase, wsBase, enableMocks, sentryDsn, buildEnv }.
  - wsBase is derived from apiBase if not set. If http -> ws, https -> wss.
- API client (src/services/apiClient.js):
  - Attaches Authorization Bearer token (managed via localStorage and setToken()).
  - When REACT_APP_ENABLE_MOCKS is "true", returns mocked responses without calling backend.
- WebSocket (src/services/websocket.js):
  - createWS(path, params) builds ws URL using wsBase and query string params.
  - Logs a warning if wsBase is not configured and returns null.

## Assumed REST and WebSocket Endpoints

These endpoint path segments are defined in src/services/endpoints.js. The frontend prefixes them with apiBase from env.js when calling real backend. Backend teams should align to these paths or provide an adapter layer.

- Auth
  - POST /auth/login
  - POST /auth/logout
  - POST /auth/register
  - POST /auth/refresh
  - GET  /auth/me
- Admin
  - Users: GET/POST /admin/users; GET/PUT/PATCH/DELETE /admin/users/:id
  - Reports: GET /admin/reports; GET /admin/reports/:id/export
  - Questions: GET/POST /admin/questions; GET/PUT/PATCH/DELETE /admin/questions/:id; POST /admin/questions/import; GET /admin/questions/export
  - Tests (templates): GET/POST /admin/tests/templates; GET/PUT/PATCH/DELETE /admin/tests/templates/:id
- HR
  - Assignments: /hr/assignments
  - Test Configs: /hr/tests/configs
  - Patterns: /hr/tests/patterns
  - Results: /hr/results; GET /hr/results/export
  - Reappear: /hr/reappear; /hr/reappear/:id
  - Employees: /hr/employees
  - Assign to employee: /hr/assign-to-employee
  - Candidates bulk upload: /hr/candidates/bulk
  - Email triggers: /hr/emails/triggers
- Candidate
  - Profile: /candidate/profile
  - Resume: /candidate/resume
  - Questionnaire: /candidate/questionnaire
  - Interviews: /candidate/interviews; /candidate/interviews/:id
- Chat
  - Threads: /chat/threads
  - Messages: /chat/threads/:threadId/messages
- WebSocket
  - HR Live Monitor: wsBase + /ws/hr/live
  - Chat adapter: wsBase + /chat?room=<room>

## Style Guide

This project follows the Ocean Professional theme with a modern aesthetic:
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827
Tokens are defined in src/theme/tokens.css and global styles in src/theme/global.css. Prefer subtle shadows, rounded corners, minimalistic layouts, and smooth transitions for interactive elements.

## Anti-Cheat Considerations

Client-side guards help reduce casual cheating but cannot provide full enforcement. Current client-side measures include:
- Fullscreen enforcement (components/test/FullscreenGuard.jsx)
- Clipboard blocking and context menu blocking (hooks/useClipboardBlock.js)
- Tab visibility tracking (hooks/useTabVisibility.js)
- Idle detection (hooks/useIdleDetection.js)
- Before unload guard (hooks/useBeforeUnloadGuard.js)
- Focus/blur and event logging (components/test/AntiCheatGuard.jsx)
Server-side enforcement expectations:
- Validate attempt timing, question exposure, and answer submission order on server.
- Track violations received from the client and decide penalties.
- Ensure secure token/session handling and rate limiting.
- For screen/camera recording, capture and store streams server-side; the frontend only previews and requests permissions today.

## Notes

- By default enableMocks is true; to integrate with a real backend set REACT_APP_ENABLE_MOCKS=false in .env and provide REACT_APP_API_BASE_URL and REACT_APP_WS_BASE_URL.
- Do not commit secrets. Use environment variables for DSNs and keys.

