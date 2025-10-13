import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login page placeholder - no backend calls yet.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const nav = useNavigate();

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Use your credentials to access your dashboard.</p>
      <div className="mt-16" style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }} />
        <input placeholder="Password" type="password" style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }} />
        <Button onClick={() => nav('/candidate')}>Sign in (Candidate)</Button>
        <div style={{ display: 'grid', gap: 8 }}>
          <Button variant="secondary" onClick={() => nav('/admin')}>Sign in (Admin)</Button>
          <Button variant="secondary" onClick={() => nav('/hr')}>Sign in (HR)</Button>
          <Button variant="secondary" onClick={() => nav('/employee')}>Sign in (Employee)</Button>
        </div>
        <div className="mt-16" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/auth/forgot-password">Forgot password?</Link>
          <Link to="/auth/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
