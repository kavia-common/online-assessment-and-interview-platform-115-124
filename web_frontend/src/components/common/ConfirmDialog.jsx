import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ConfirmDialog - lightweight confirmation dialog with message and actions.
 */
export default function ConfirmDialog({ open, title = 'Confirm', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 60,
      }}
    >
      <div className="card p-20" onClick={(e) => e.stopPropagation()} style={{ width: 'min(480px,95vw)' }}>
        <div className="flex items-center justify-between mb-16">
          <strong>{title}</strong>
          <button onClick={onCancel} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{message}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', cursor: 'pointer' }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid transparent', background: 'var(--color-error)', color: '#fff', cursor: 'pointer' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
