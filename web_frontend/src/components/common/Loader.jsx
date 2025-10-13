import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Loader - Simple loading indicator component.
 */
export default function Loader({ text = 'Loading...', inline = false, size = 16 }) {
  const style = inline
    ? { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }
    : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 8, fontSize: 14 };

  return (
    <div style={style} role="status" aria-busy="true">
      <span className="spinner" style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid var(--border-color, #e5e7eb)',
        borderTopColor: 'var(--color-primary, #2563EB)',
        animation: 'spin 1s linear infinite'
      }} />
      <span>{text}</span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
