const baseURL = (typeof process !== 'undefined' && (process as any).env && (process as any).env.REACT_APP_API_BASE_URL) || '/api';

/**
 * generic api utils
 * Prefer using apiClient.js for authenticated REST calls.
 */
async function request(path: string, options: RequestInit = {}) {
  const url = baseURL.replace(/\/$/, '') + path;
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  }).then(async (res) => {
    const text = await res.text();
    try {
      const json = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error((json && json.message) || `HTTP ${res.status}`);
      return json;
    } catch (e) {
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
      return null;
    }
  });
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Basic GET wrapper */
  get: (path: string) => request(path, { method: 'GET' }),
  /** Basic POST wrapper */
  post: (path: string, body?: any) => request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  /** Basic PUT wrapper */
  put: (path: string, body?: any) => request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  /** Basic DELETE wrapper */
  delete: (path: string) => request(path, { method: 'DELETE' }),
  /** Returns configured base URL */
  baseURL,
};

export default apiClient;
