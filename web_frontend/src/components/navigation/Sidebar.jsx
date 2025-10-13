import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Collapsible Sidebar with smooth width transition and active highlighting.
 */
const Sidebar = ({ links = [] }) => {
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? 64 : 240;

  return (
    <aside className="sidebar" style={{ width, background: 'var(--surface)', borderRight: '1px solid var(--border)', height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--border)' }}>
        {!collapsed && <div style={{ fontWeight: 700 }}>Platform</div>}
        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 6px' }}
        >
          {collapsed ? '⟩' : '⟨'}
        </button>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className="sidebar-link"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              color: isActive ? 'var(--color-primary)' : 'inherit',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              background: isActive ? 'var(--color-primary-50)' : 'transparent',
            })}
          >
            <span aria-hidden="true">{l.icon}</span>
            {!collapsed && <span>{l.label}</span>}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar-link:hover { background: rgba(17,24,39,0.03); }
        @media (max-width: 480px) {
          aside.sidebar { position: fixed; z-index: 40; height: 100vh; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
