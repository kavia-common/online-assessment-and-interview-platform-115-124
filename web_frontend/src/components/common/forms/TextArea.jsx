import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Accessible TextArea with helper text and error messages.
 */
const TextArea = ({ label, value, onChange, error, helperText, rows = 4, id, required, ...props }) => {
  const taId = id || `ta_${Math.random().toString(36).slice(2, 8)}`;
  const describedBy = error ? `${taId}_error` : helperText ? `${taId}_help` : undefined;

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label && <label htmlFor={taId} style={{ fontWeight: 600 }}>{label}{required ? ' *' : ''}</label>}
      <textarea
        id={taId}
        rows={rows}
        value={value}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--border)'}`,
          padding: 12,
          outline: 'none',
          resize: 'vertical',
          transition: `box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease`,
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-focus)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--border)'; }}
        {...props}
      />
      {helperText && !error && <div id={`${taId}_help`} className="muted" style={{ fontSize: 12 }}>{helperText}</div>}
      {error && <div id={`${taId}_error`} style={{ color: 'var(--color-error)', fontSize: 12 }}>{error}</div>}
    </div>
  );
};

export default TextArea;
