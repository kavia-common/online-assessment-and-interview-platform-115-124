import React, { useEffect, useRef, useCallback } from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal - Accessible modal with focus trap, ESC close, and ARIA attributes.
 * Props:
 * - open: boolean - whether the modal is visible
 * - title: string|node - title displayed at the top
 * - children: node - modal body content
 * - onClose: function - called to close the modal
 * - actions: node - footer action buttons
 * - initialFocusRef: ref - optional ref to element to focus on open
 */
export default function Modal({ open, title, children, onClose, actions, initialFocusRef }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const prevFocusRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      } else if (e.key === 'Tab') {
        // Focus trap
        const focusableSelectors = [
          'a[href]',
          'button:not([disabled])',
          'input:not([disabled]):not([type="hidden"])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ];
        const focusables = dialogRef.current
          ? Array.from(dialogRef.current.querySelectorAll(focusableSelectors.join(','))).filter(
              (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
            )
          : [];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement;

    const toFocus =
      initialFocusRef?.current ||
      dialogRef.current?.querySelector('[data-autofocus]') ||
      dialogRef.current;

    const t = setTimeout(() => {
      toFocus && toFocus.focus && toFocus.focus();
    }, 0);

    document.addEventListener('keydown', handleKeyDown, true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow;
      // restore focus
      const prev = prevFocusRef.current;
      if (prev && prev.focus) prev.focus();
    };
  }, [open, handleKeyDown, initialFocusRef]);

  if (!open) return null;

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      role="presentation"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="card"
        style={{
          width: 'min(600px, 95vw)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          outline: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h3 id={titleId} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              marginLeft: 'auto',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
        {actions && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              padding: 16,
              borderTop: '1px solid var(--border-color)',
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
