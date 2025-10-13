import React, { createContext, useContext, useCallback, useMemo, useState, useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Toast context and provider with stacking, max visible, and auto dismiss.
 */
export const ToastContext = createContext({
  notify: (_msg, _type = 'info', _timeout) => {},
});

export const useToast = () => useContext(ToastContext);

const MAX_VISIBLE = 3;

const ToastItem = ({ id, title, description, type = 'info', duration = 3500, onDismiss }) => {
  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timerRef.current);
  }, [duration, id, onDismiss]);

  const color =
    type === 'error' ? 'var(--color-error)' :
    type === 'success' ? 'var(--color-success)' :
    type === 'warning' ? 'var(--color-secondary)' :
    'var(--color-primary)';

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: `4px solid ${color}`, padding: '12px 14px', minWidth: 240 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {description && <div className="muted" style={{ marginLeft: 8 }}>{description}</div>}
      <button onClick={() => onDismiss(id)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-muted)' }} aria-label="Dismiss">✕</button>
    </div>
  );
};

/**
 * PUBLIC_INTERFACE
 * ToastProvider component. Provides context and renders stacked toasts.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((title, type = 'info', timeout = 3500, description) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      const next = [...prev, { id, title, description, type, duration: timeout }];
      if (next.length > MAX_VISIBLE) next.shift();
      return next;
    });
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Default export preserved for backward compatibility; export the provider as default.
export default ToastProvider;
