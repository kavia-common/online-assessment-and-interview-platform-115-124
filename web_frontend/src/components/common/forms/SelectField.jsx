import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Accessible SelectField with helper text and error messages.
 */
const SelectField = ({ label, value, onChange, options = [], error, helperText, id, required, ...props }) => {
  const selectId = id || `sf_${Math.random().toString(36).slice(2, 8)}`;
  const describedBy = error ? `${selectId}_error` : helperText ? `${selectId}_help` : undefined;

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label && <label htmlFor={selectId} style={{ fontWeight: 600 }}>{label}{required ? ' *' : ''}</label>}
      <select
        id={selectId}
        value={value}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          height: 'var(--input-height)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--border)'}`,
          padding: '0 12px',
          outline: 'none',
          background: 'var(--surface)',
          transition: `box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease`,
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-focus)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--border)'; }}
        {...props}
      >
        {options.map((o) => <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? o : o.label}</option>)}
      </select>
      {helperText && !error && <div id={`${selectId}_help`} className="muted" style={{ fontSize: 12 }}>{helperText}</div>}
      {error && <div id={`${selectId}_error`} style={{ color: 'var(--color-error)', fontSize: 12 }}>{error}</div>}
    </div>
  );
};

export default SelectField;
