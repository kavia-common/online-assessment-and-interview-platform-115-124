/// PUBLIC INTERFACE
/**
 * Environment configuration utilities for the frontend.
 * Ensures safe defaults and normalizes URL values.
 */

const readEnv = (key, fallback) => {
  try {
    // CRA uses process.env, Vite uses import.meta.env
    const value = (typeof import.meta !== 'undefined' ? import.meta.env?.[key] : undefined) ?? process?.env?.[key];
    return value === undefined || value === null || value === '' ? fallback : value;
  } catch {
    return fallback;
  }
};

const normalizeUrl = (value, opts = { stripTrailingSlash: true }) => {
  if (!value) return value;
  let v = String(value).trim();
  if (opts.stripTrailingSlash) v = v.replace(/\/+$/, '');
  return v;
};

const API_BASE_URL = normalizeUrl(readEnv('REACT_APP_API_BASE_URL', 'http://localhost:8000'));
const WS_BASE_URL = normalizeUrl(readEnv('REACT_APP_WS_BASE_URL', 'ws://localhost:8000'));
const ENABLE_MOCKS = String(readEnv('REACT_APP_ENABLE_MOCKS', 'false')).toLowerCase() === 'true';
const SITE_URL = normalizeUrl(readEnv('REACT_APP_SITE_URL', 'http://localhost:3000'));

export const API_PREFIX = '/api/v1';
export const WS_PREFIX = '/ws';

const env = {
  API_BASE_URL,
  WS_BASE_URL,
  ENABLE_MOCKS,
  SITE_URL,
};

export default env;
