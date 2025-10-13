import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * RetryButton that uses secondary variant by default and supports overrides.
 */
const RetryButton = ({ onRetry, children = 'Retry', variant = 'secondary', ...props }) => {
  return <Button onClick={onRetry} variant={variant} {...props}>{children}</Button>;
};

export default RetryButton;
