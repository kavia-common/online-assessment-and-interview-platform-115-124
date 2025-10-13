import React, { useRef, useState } from 'react';
import Button from '../../common/Button';

/**
 * PUBLIC_INTERFACE
 * FileUpload - input for uploading a single file, with accept types and size validation.
 */
export default function FileUpload({
  label = 'Upload file',
  name = 'file',
  accept = '.pdf,.doc,.docx',
  maxSizeMB = 5,
  onFileSelect,
  onUpload, // async callback to send to API; receives File and returns {url | id}
  helpText = 'Accepted: PDF/DOC/DOCX up to 5MB',
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploaded, setUploaded] = useState(null);

  const openPicker = () => inputRef.current?.click();

  const validate = (f) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (!f) return 'Please choose a file';
    if (f.size > maxBytes) return `File size exceeds ${maxSizeMB}MB`;
    const ext = f.name.toLowerCase().split('.').pop();
    const allowed = accept
      .split(',')
      .map((a) => a.trim().replace('.', '').toLowerCase());
    if (!allowed.includes(ext)) return `Unsupported file type .${ext}`;
    return '';
  };

  const onChange = (e) => {
    const f = e.target.files?.[0];
    const err = validate(f);
    setError(err);
    setFile(err ? null : f);
    setUploaded(null);
    onFileSelect?.(f, err);
  };

  const doUpload = async () => {
    if (!file) return;
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await onUpload?.(file);
      setUploaded(res || { success: true });
    } catch (e) {
      setError(e?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label && <label style={{ fontWeight: 600 }}>{label}</label>}
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <div className="card p-16" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="secondary" type="button" onClick={openPicker}>
          Choose File
        </Button>
        <div style={{ flex: 1, color: file ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {file ? file.name : 'No file selected'}
        </div>
        <Button type="button" onClick={doUpload} disabled={!file || busy}>
          {busy ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {!error && helpText && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{helpText}</div>}
      {error && (
        <div role="alert" style={{ fontSize: 12, color: 'var(--color-error)' }}>
          {error}
        </div>
      )}
      {uploaded && (
        <div style={{ fontSize: 12, color: 'var(--color-success)' }}>
          File uploaded successfully.
        </div>
      )}
    </div>
  );
}
