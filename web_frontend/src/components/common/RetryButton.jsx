import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * RetryButton - A small convenience wrapper to standardize retry action buttons.
 */
export default function RetryButton({ onClick, children = 'Retry' }) {
  return <Button variant="secondary" onClick={onClick}>{children}</Button>;
}
