import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { AuthContext } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login page integrating AuthContext.login; redirects based on role.
 */
export default function Login() {
  const { login, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'hr') navigate('/hr', { replace: true });
    else if (role === 'employee') navigate('/employee', { replace: true });
    else navigate('/candidate', { replace: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      const me = await refreshProfile();
      const role = me?.role || JSON.parse(localStorage.getItem('user_role') || 'null') || 'candidate';
      redirectByRole(role);
    } catch (err) {
      setError(err?.detail?.message || err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      <p className="muted">Use your credentials to access your dashboard.</p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color, #e5e7eb)' }}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color, #e5e7eb)' }}
          required
        />
        {error && <div className="error" style={{ color: 'var(--color-error)' }}>{error}</div>}
        <Button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</Button>
        <div className="mt-16" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/auth/forgot-password">Forgot password?</Link>
          <Link to="/auth/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
