import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Topbar renders the app bar with title and quick actions.
 */
export default function Topbar({ title = 'App' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: 'var(--topbar-height)',
      padding: '0 16px',
      gap: 12,
    }}>
      <div style={{ width: 8, height: 8, background: 'var(--color-primary)', borderRadius: 999 }} />
      <strong style={{ fontSize: 16 }}>{title}</strong>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button className="btn" style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          cursor: 'pointer'
        }}>Help</button>
      </div>
    </div>
  );
}
