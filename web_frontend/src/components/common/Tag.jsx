import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Tag - pill label with color scheme
 */
export default function Tag({ color = 'primary', children }) {
  const map = {
    primary: { bg: 'rgba(37,99,235,0.1)', color: 'var(--color-primary)' },
    success: { bg: 'rgba(16,185,129,0.12)', color: '#059669' },
    warning: { bg: 'rgba(245,158,11,0.12)', color: '#92400E' },
    error: { bg: 'rgba(239,68,68,0.12)', color: '#991B1B' },
  };
  const c = map[color] || map.primary;
  return (
    <span style={{
      padding: '6px 10px',
      borderRadius: 999,
      background: c.bg,
      color: c.color,
      fontSize: 12,
      fontWeight: 600,
    }}>{children}</span>
  );
}
