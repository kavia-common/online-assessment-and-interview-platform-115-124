import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SelectField - controlled select with label, options and error message.
 */
export default function SelectField({
  label,
  value,
  onChange,
  name,
  options = [],
  placeholder = 'Select...',
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
      <select
        id={name}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value, e)}
        aria-invalid={!!error}
        style={{
          padding: 12,
          borderRadius: 10,
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-color)'}`,
          background: 'var(--bg-surface)',
        }}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && (
        <div role="alert" style={{ fontSize: 12, color: 'var(--color-error)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
