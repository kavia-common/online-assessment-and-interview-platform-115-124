import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/theme.css';

type Props = {
  onToggleSidebar?: () => void;
  connectionIndicator?: React.ReactNode;
  queueIndicator?: React.ReactNode;
};

/**
 * Topbar with app title, role switcher, indicators.
 */
const Topbar: React.FC<Props> = ({ onToggleSidebar, connectionIndicator, queueIndicator }) => {
  const { role, setRole } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as any);
  };

  return (
    <header className="topbar topbar-area" role="banner" aria-label="Top Bar">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 12px', gap: 12 }}>
        <button aria-label="Toggle sidebar" className="btn btn-ghost" onClick={onToggleSidebar}>
          ☰
        </button>
        <strong style={{ color: 'var(--color-primary)' }}>Online Assessment</strong>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {connectionIndicator}
          {queueIndicator}
          <label htmlFor="role-switch" className="muted" style={{ display: 'none' }}>Role</label>
          <select
            id="role-switch"
            aria-label="Select Role"
            className="input"
            value={role}
            onChange={handleChange}
          >
            <option value="candidate">Candidate</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
