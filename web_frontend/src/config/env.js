/// PUBLIC INTERFACE
/**
 * Provides environment variables with safe defaults for the frontend.
 * Values are read from process.env and fallback to local development defaults
 * to avoid runtime crashes when envs are missing.
 */
const env = {
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000',
  WS_BASE_URL:
    process.env.REACT_APP_WS_BASE_URL?.replace(/\/+$/, '') || 'ws://localhost:8000',
  ENABLE_MOCKS:
    (process.env.REACT_APP_ENABLE_MOCKS || 'false').toLowerCase() === 'true',
};

export default env;
