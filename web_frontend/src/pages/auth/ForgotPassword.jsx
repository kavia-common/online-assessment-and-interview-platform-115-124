import React from 'react';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Forgot Password placeholder.
 */
export default function ForgotPassword() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Reset password</h2>
      <div className="mt-16" style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Email" style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }} />
        <Button>Send reset link</Button>
        <div className="mt-16">
          <Link to="/auth/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
