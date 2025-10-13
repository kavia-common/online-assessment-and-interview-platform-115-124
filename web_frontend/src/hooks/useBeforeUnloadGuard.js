import { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * useBeforeUnloadGuard prompts the user when they try to close/refresh.
 */
export default function useBeforeUnloadGuard(enabled = true, message = 'Are you sure you want to leave? Your test progress may be lost.') {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [enabled, message]);
}
