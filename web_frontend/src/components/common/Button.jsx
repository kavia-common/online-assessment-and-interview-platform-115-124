import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button - styled button with variants.
 */
export default function Button({ children, variant = 'primary', ...rest }) {
  const colorMap = {
    primary: { bg: 'var(--color-primary)', color: '#fff', border: 'transparent' },
    secondary: { bg: 'var(--color-secondary)', color: '#111827', border: 'transparent' },
    ghost: { bg: 'transparent', color: 'var(--color-primary)', border: 'var(--color-primary)' },
  };
  const c = colorMap[variant] || colorMap.primary;

  return (
    <button
      {...rest}
      style={{
        padding: '10px 14px',
        borderRadius: '10px',
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.color,
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </button>
  );
}
