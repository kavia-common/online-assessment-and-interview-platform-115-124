import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal - simple centered modal with backdrop.
 */
export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'grid', placeItems: 'center', zIndex: 50
    }} onClick={onClose}>
      <div className="card" style={{ width: 'min(560px, 95vw)', padding: 20 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-16">
          <strong>{title}</strong>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
