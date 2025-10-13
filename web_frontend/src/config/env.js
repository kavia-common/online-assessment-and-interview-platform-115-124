//
// PUBLIC_INTERFACE
// env config helper to safely read CRA environment variables with defaults
//
/**
 * PUBLIC_INTERFACE
 * getEnv returns environment configuration used by the frontend.
 */
export function getEnv() {
  /** This is a public function that returns resolved environment configuration. */
  const {
    REACT_APP_API_BASE_URL,
    REACT_APP_WS_BASE_URL,
    REACT_APP_ENABLE_MOCKS,
    REACT_APP_SENTRY_DSN,
    REACT_APP_BUILD_ENV,
  } = process.env || {};

  // Defaults suitable for local development
  const apiBase = REACT_APP_API_BASE_URL || 'http://localhost:4000';
  const wsBase =
    REACT_APP_WS_BASE_URL ||
    (apiBase.startsWith('https:')
      ? apiBase.replace('https', 'wss')
      : apiBase.replace('http', 'ws'));
  // Per spec: default mocks to false
  const enableMocks = String(REACT_APP_ENABLE_MOCKS || 'false') === 'true';
  const sentryDsn = REACT_APP_SENTRY_DSN || '';
  const buildEnv = REACT_APP_BUILD_ENV || 'development';

  return {
    apiBase,
    wsBase,
    enableMocks,
    sentryDsn,
    buildEnv,
  };
}
