import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TextArea - controlled textarea with label and error.
 */
export default function TextArea({
  label,
  value,
  onChange,
  name,
  rows = 5,
  placeholder,
  required = false,
  error,
  ...rest
}) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label && (
        <label htmlFor={name} style={{ fontWeight: 600 }}>
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value, e)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!error}
        style={{
          padding: 12,
          borderRadius: 10,
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-color)'}`,
          background: 'var(--bg-surface)',
          resize: 'vertical',
        }}
        {...rest}
      />
      {error && (
        <div role="alert" style={{ fontSize: 12, color: 'var(--color-error)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
