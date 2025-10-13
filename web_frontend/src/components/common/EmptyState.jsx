import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Themed EmptyState to show no-data screens consistently.
 */
const EmptyState = ({ title = 'Nothing here', description = 'There is no data to show yet.', actionText, onAction, icon }) => {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
      {icon ? <div style={{ fontSize: 28, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>{icon}</div> : null}
      <div style={{ fontSize: 18, marginBottom: 6, color: 'var(--text-primary)', fontWeight: 600 }}>{title}</div>
      <div className="muted" style={{ marginBottom: 12 }}>{description}</div>
      {actionText && <Button onClick={onAction} variant="ghost">{actionText}</Button>}
    </div>
  );
};

export default EmptyState;
