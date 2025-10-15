/**
 * Lightweight API client built on fetch with:
 * - Base URL from env
 * - Bearer token injection
 * - 401 handling with refresh or logout
 * - JSON parsing and error surfacing
 */
import env from '../config/env';
import { endpoints } from './endpoints';

let getToken = () => {
  try { return localStorage.getItem('auth_token') || localStorage.getItem('token'); } catch { return null; }
};
let setToken = (t) => { try {
  localStorage.setItem('auth_token', t || '');
  localStorage.setItem('token', t || '');
} catch {} };
let clearToken = () => { try {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token');
} catch {} };

let refreshing = false;
let pending = [];

// PUBLIC_INTERFACE
export function setAuthTokenProvider(providerFns) {
  /** Set custom providers for token storage (optional) */
  if (providerFns?.getToken) getToken = providerFns.getToken;
  if (providerFns?.setToken) setToken = providerFns.setToken;
  if (providerFns?.clearToken) clearToken = providerFns.clearToken;
}

// PUBLIC_INTERFACE
export const getStoredToken = () => getToken();

async function doRefresh() {
  if (refreshing) {
    return new Promise((resolve, reject) => pending.push({ resolve, reject }));
  }
  refreshing = true;
  try {
    const res = await fetch(`${env.API_BASE_URL}${endpoints.auth.refresh()}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Refresh failed');
    const data = await res.json();
    if (data?.access_token) {
      setToken(data.access_token);
      pending.forEach(p => p.resolve(data.access_token));
      pending = [];
      return data.access_token;
    }
    throw new Error('No token in refresh');
  } catch (e) {
    pending.forEach(p => p.reject(e));
    pending = [];
    clearToken();
    return null;
  } finally {
    refreshing = false;
  }
}

async function handle401AndRetry(input, init) {
  const newToken = await doRefresh();
  if (!newToken) {
    // Allow app-level logout by dispatching an event
    try { window.dispatchEvent(new CustomEvent('auth:logout')); } catch {}
    return Promise.reject({ status: 401, message: 'Unauthorized' });
  }
  const retryHeaders = new Headers(init?.headers || {});
  retryHeaders.set('Authorization', `Bearer ${newToken}`);
  return fetch(input, { ...init, headers: retryHeaders });
}

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /** Primary fetch wrapper for REST API. */
  const url = path.startsWith('http') ? path : `${env.API_BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const init = { ...options, headers };

  let res = await fetch(url, init);

  if (res.status === 401) {
    res = await handle401AndRetry(url, init);
  }
  if (!res.ok) {
    let errorDetail = {};
    try {
      errorDetail = await res.json();
    } catch {
      // non-json error
    }
    const err = new Error(errorDetail?.detail || res.statusText || 'Request failed');
    err.status = res.status;
    err.detail = errorDetail;
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// PUBLIC_INTERFACE
export const withBase = (p) => `${env.API_BASE_URL}${p}`;

// PUBLIC_INTERFACE
export const apiClient = {
  get: (path, init) => apiFetch(path, { ...init, method: 'GET' }),
  post: (path, body, init) =>
    apiFetch(path, { ...init, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  put: (path, body, init) =>
    apiFetch(path, { ...init, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  patch: (path, body, init) =>
    apiFetch(path, { ...init, method: 'PATCH', body: JSON.stringify(body || {}) }),
  delete: (path, init) => apiFetch(path, { ...init, method: 'DELETE' }),
};

export default apiClient;
