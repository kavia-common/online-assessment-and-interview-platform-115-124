import React from 'react';
import RetryButton from './RetryButton';

/**
 * PUBLIC_INTERFACE
 * ErrorState - Standard error presentation component with optional retry.
 */
export default function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  if (!error) return null;
  const message = error?.message || 'An unexpected error occurred.';
  const code = error?.status ? ` (code: ${error.status})` : '';

  return (
    <div
      className="card p-16"
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        background: 'var(--bg-surface)',
      }}
    >
      <div
        style={{
          color: 'var(--color-error, #EF4444)',
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {title}{code}
      </div>
      <div style={{ marginBottom: 8 }}>{message}</div>
      {onRetry && <RetryButton onClick={onRetry} />}
    </div>
  );
}
