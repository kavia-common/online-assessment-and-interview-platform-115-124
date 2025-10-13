import React from 'react';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Register page placeholder.
 */
export default function Register() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Create account</h2>
      <div className="mt-16" style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Full name" style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }} />
        <input placeholder="Email" style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }} />
        <input placeholder="Password" type="password" style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }} />
        <Button>Create account</Button>
        <div className="mt-16">
          <Link to="/auth/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
