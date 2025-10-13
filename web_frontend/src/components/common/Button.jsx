import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button - styled button with variants and loading state.
 */
const Button = React.forwardRef(function Button(
  { children, variant = 'primary', loading = false, disabled, ...rest },
  ref
) {
  const colorMap = {
    primary: { bg: 'var(--color-primary)', color: '#fff', border: 'transparent' },
    secondary: { bg: 'var(--color-secondary)', color: '#111827', border: 'transparent' },
    danger: { bg: '#EF4444', color: '#fff', border: 'transparent' },
    ghost: { bg: 'transparent', color: 'var(--color-primary)', border: 'var(--color-primary)' },
  };
  const c = colorMap[variant] || colorMap.primary;
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.color,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: 'var(--shadow-sm)',
        opacity: isDisabled ? 0.7 : 1,
      }}
    >
      {loading ? 'Processing…' : children}
    </button>
  );
});

export default Button;
