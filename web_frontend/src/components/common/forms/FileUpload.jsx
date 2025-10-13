import React from 'react';
import Button from '../Button';

/**
 * PUBLIC_INTERFACE
 * FileUpload with helper/error messages and consistent button.
 */
const FileUpload = ({ label, onChange, accept, error, helperText, id, required }) => {
  const inputRef = React.useRef(null);
  const handleClick = () => inputRef.current?.click();
  const handleChange = (e) => onChange && onChange(e.target.files?.[0] || null);
  const inputId = id || `fu_${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label && <label htmlFor={inputId} style={{ fontWeight: 600 }}>{label}{required ? ' *' : ''}</label>}
      <input id={inputId} ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleChange} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button variant="ghost" onClick={handleClick}>Choose File</Button>
        <span className="muted" style={{ fontSize: 12 }}>(Max 10MB)</span>
      </div>
      {helperText && !error && <div className="muted" style={{ fontSize: 12 }}>{helperText}</div>}
      {error && <div style={{ color: 'var(--color-error)', fontSize: 12 }}>{error}</div>}
    </div>
  );
};

export default FileUpload;
