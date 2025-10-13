import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';

/**
 * ToastProvider provides a simple pub/sub for toast notifications.
 * Uses ARIA live regions for screen readers.
 */

// PUBLIC_INTERFACE
export const ToastContext = createContext({
  notify: (_msg, _type = 'info', _timeout) => {},
});

/** PUBLIC_INTERFACE */
export const useToast = () => useContext(ToastContext);

const ToastItem = ({ id, message, type, onDismiss }) => {
  const bg =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
      ? 'bg-red-600'
      : type === 'warning'
      ? 'bg-yellow-600'
      : 'bg-blue-600';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${bg} text-white px-4 py-2 rounded shadow-md flex items-start gap-3`}
    >
      <span className="sr-only">{type}:</span>
      <div className="flex-1">{message}</div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="opacity-90 hover:opacity-100 focus:outline-none focus:ring focus:ring-white/50 rounded"
      >
        ✕
      </button>
    </div>
  );
};

/** PUBLIC_INTERFACE */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = 'info', timeout = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (timeout) {
      setTimeout(() => dismiss(id), timeout);
    }
  }, [dismiss]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[1100] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
