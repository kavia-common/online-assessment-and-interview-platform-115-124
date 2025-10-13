import { getEnv } from '../config/env';

/**
 * Simple in-memory token accessor with fallback to localStorage.
 * AuthContext should keep this in sync by calling setToken on login/logout.
 */
let authToken = null;

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Set auth token to be attached on subsequent API calls. */
  authToken = token || null;
  if (token) {
    try { localStorage.setItem('auth_token', token); } catch { /* noop */ }
  } else {
    try { localStorage.removeItem('auth_token'); } catch { /* noop */ }
  }
}

// Attempt to hydrate token on initial import
try {
  const stored = localStorage.getItem('auth_token');
  if (stored) authToken = stored;
} catch {
  // ignore SSR or storage errors
}

// PUBLIC_INTERFACE
export function normalizeApiError(e) {
  /** Normalize errors thrown by request into a consistent shape */
  if (!e) return { message: 'Unknown error' };
  const status = e.status || undefined;
  const data = e.data || undefined;
  const message = e.message || data?.message || 'Request failed';
  return { message, status, data };
}

/**
 * Internal request helper using fetch with baseURL and JSON defaults.
 */
async function request(path, { method = 'GET', headers = {}, body, ...rest } = {}) {
  const { apiBase, enableMocks } = getEnv();
  const url = path.startsWith('http') ? path : `${apiBase}${path}`;

  const finalHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (authToken) {
    finalHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  // Placeholder mock behavior: do not actually call a backend during this step
  if (enableMocks) {
    // Return a basic mocked response structure with small latency
    await new Promise((r) => setTimeout(r, 150));
    return {
      ok: true,
      status: 200,
      data: { success: true, path, method, body: body ? JSON.parse(body) : undefined },
    };
  }

  let resp;
  try {
    resp = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch (networkErr) {
    const err = new Error('Network error');
    err.status = 0;
    err.data = { cause: String(networkErr) };
    throw err;
  }

  // 204 No Content
  if (resp.status === 204) {
    return { ok: true, status: 204, data: null };
  }

  let data = null;
  try {
    data = await resp.json();
  } catch {
    // Non-json
  }

  if (resp.status === 401) {
    // Allow upper layers to react (e.g., logout)
    const err = new Error('Unauthorized');
    err.status = 401;
    err.data = data;
    throw err;
  }

  if (!resp.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return { ok: true, status: resp.status, data };
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** GET JSON */
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  /** POST JSON */
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  /** PUT JSON */
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  /** PATCH JSON */
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  /** DELETE JSON */
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};
