import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Topbar with user display and logout action.
 */
const Topbar = ({ title = 'Assessment Platform' }) => {
  const { user, role, logout } = useContext(AuthContext);

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 20, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user && <span className="muted">{user?.name || user?.email} · {role}</span>}
          {user && <button className="btn btn-outline" onClick={logout}>Logout</button>}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
