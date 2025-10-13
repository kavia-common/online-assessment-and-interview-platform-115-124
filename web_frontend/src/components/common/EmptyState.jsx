import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmptyState - Display a consistent empty content message.
 */
export default function EmptyState({ title = 'No data', description = 'There is nothing to display yet.' }) {
  return (
    <div className="card p-16" style={{ border: '1px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-surface)' }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ color: 'var(--text-muted, #6b7280)' }}>{description}</div>
    </div>
  );
}
