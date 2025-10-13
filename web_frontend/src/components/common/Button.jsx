import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button component with standardized variants, sizes, and interaction states.
 */
const Button = React.forwardRef(function Button(
  {
    children,
    onClick,
    variant = 'primary', // primary | secondary | ghost | destructive
    size = 'md', // sm | md | lg
    disabled = false,
    loading = false,
    icon,
    block = false,
    type = 'button',
    ...props
  },
  ref
) {
  const heights = { sm: 32, md: 40, lg: 48 };
  const paddings = { sm: '0 12px', md: '0 var(--btn-padding-x)', lg: '0 20px' };
  const radius = 'var(--radius-md)';

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: `${heights[size]}px`,
    padding: paddings[size],
    borderRadius: radius,
    border: '1px solid transparent',
    fontWeight: 600,
    lineHeight: 1,
    transition: `background-color var(--transition-normal) ease, color var(--transition-normal) ease, box-shadow var(--transition-fast) ease, transform var(--transition-fast) ease`,
    width: block ? '100%' : undefined,
    userSelect: 'none',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#fff',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: '#111827',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--border)',
    },
    destructive: {
      backgroundColor: 'var(--color-error)',
      color: '#fff',
    },
  };

  const hover = {
    primary: { backgroundColor: 'var(--color-primary-700)' },
    secondary: { backgroundColor: 'var(--color-secondary-600)' },
    ghost: { backgroundColor: 'rgba(37,99,235,0.06)' },
    destructive: { backgroundColor: 'var(--color-error-600)' },
  };

  const active = {
    transform: 'translateY(0.5px)',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)',
  };

  const isDisabled = disabled || loading;

  const merged = {
    ...baseStyle,
    ...(variants[variant] || variants.primary),
    ...(isDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  };

  const handleMouseEnter = (e) => {
    if (isDisabled) return;
    Object.assign(e.currentTarget.style, hover[variant] || {});
  };
  const handleMouseLeave = (e) => {
    if (isDisabled) return;
    Object.assign(e.currentTarget.style, variants[variant] || {});
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.transform = '';
  };
  const handleMouseDown = (e) => {
    if (isDisabled) return;
    Object.assign(e.currentTarget.style, active);
  };
  const handleMouseUp = (e) => {
    if (isDisabled) return;
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.transform = '';
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      style={merged}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-busy={loading || undefined}
      {...props}
    >
      {icon ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span> : null}
      <span>{loading ? 'Processing…' : children}</span>
    </button>
  );
});

export default Button;
