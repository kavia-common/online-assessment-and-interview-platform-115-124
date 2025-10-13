import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useApi - A small helper hook to standardize API calls with loading, error, data, and retry.
 * - Accepts an async function factory or function and a deps array.
 * - Normalizes errors and supports optional auto-run on mount/deps change.
 */
// PUBLIC_INTERFACE
export function useApi(asyncFnOrFactory, deps = [], { auto = true, initialData = null } = {}) {
  /** Hook to invoke an async API call and manage loading/error state. */
  const fnRef = useRef(asyncFnOrFactory);
  fnRef.current = asyncFnOrFactory;

  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(auto));
  const [attempt, setAttempt] = useState(0);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const fn = typeof fnRef.current === 'function' ? fnRef.current : () => Promise.resolve(null);
      const result = await fn(...args);
      setData(result);
      return { ok: true, data: result };
    } catch (e) {
      const normalized = normalizeError(e);
      setError(normalized);
      return { ok: false, error: normalized };
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    if (!auto) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt, auto]);

  return { data, error, loading, run, retry };
}

// PUBLIC_INTERFACE
export function normalizeError(e) {
  /** Convert various error shapes into a consistent object { message, status, data } */
  if (!e) return { message: 'Unknown error' };
  if (typeof e === 'string') return { message: e };
  const status = e.status || e.code || undefined;
  const data = e.data || undefined;
  const message =
    e.message ||
    data?.message ||
    (status === 401 ? 'Unauthorized' : 'Something went wrong');
  return { message, status, data };
}
