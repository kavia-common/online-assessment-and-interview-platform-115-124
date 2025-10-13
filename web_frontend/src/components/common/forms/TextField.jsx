import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TextField - controlled input with label and error message.
 */
export default function TextField({
  label,
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  helpText,
  ...rest
}) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label && (
        <label htmlFor={name} style={{ fontWeight: 600 }}>
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value, e)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={helpText ? `${name}-help` : undefined}
        style={{
          padding: 12,
          borderRadius: 10,
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-color)'}`,
          background: 'var(--bg-surface)',
        }}
        {...rest}
      />
      {helpText && !error && (
        <div id={`${name}-help`} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {helpText}
        </div>
      )}
      {error && (
        <div role="alert" style={{ fontSize: 12, color: 'var(--color-error)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
