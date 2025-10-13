import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Loader with consistent spinner and label.
 */
const Loader = ({ text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 16, height: 16, borderRadius: 8, border: '2px solid #E5E7EB', borderTopColor: 'var(--color-primary)', animation: 'spin var(--transition-slow) linear infinite' }} />
      <div className="muted">{text}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
