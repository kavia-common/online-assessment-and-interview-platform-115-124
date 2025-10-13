import React, { useRef } from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * ConfirmDialog - Accessible confirmation dialog using Modal.
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      initialFocusRef={confirmRef}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel} aria-label={cancelText}>
            {cancelText}
          </Button>
          <Button
            ref={confirmRef}
            variant="primary"
            onClick={onConfirm}
            data-autofocus
            aria-label={confirmText}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p id="confirm-message" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
    </Modal>
  );
}
