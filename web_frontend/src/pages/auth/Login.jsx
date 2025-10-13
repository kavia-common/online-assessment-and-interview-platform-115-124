import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Login page - wires into AuthContext.login with placeholder auth.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password, role });
      // Redirect handled inside login by role
    } catch (err) {
      // In a real app, display error toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Use your credentials to access your dashboard.</p>
      <form onSubmit={onSubmit} className="mt-16" style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}
        >
          <option value="candidate">Candidate</option>
          <option value="admin">Admin</option>
          <option value="hr">HR</option>
          <option value="employee">Employee</option>
        </select>
        <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        <div className="mt-16" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/auth/forgot-password">Forgot password?</Link>
          <Link to="/auth/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
