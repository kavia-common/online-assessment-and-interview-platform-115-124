import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * ErrorState with themed visuals and optional retry action.
 */
const ErrorState = ({ title = 'Something went wrong', description = 'Please try again.', onRetry }) => {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)', borderColor: 'var(--color-error-50)', background: 'var(--color-error-50)' }}>
      <div style={{ fontSize: 18, marginBottom: 6, color: 'var(--color-error)', fontWeight: 600 }}>{title}</div>
      <div className="muted" style={{ marginBottom: 12 }}>{description}</div>
      {onRetry && <Button onClick={onRetry} variant="destructive">Retry</Button>}
    </div>
  );
};

export default ErrorState;
