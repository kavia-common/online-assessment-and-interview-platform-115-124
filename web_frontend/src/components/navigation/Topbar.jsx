import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Topbar with consistent spacing and subtle elevation.
 */
const Topbar = ({ right, title = 'Dashboard' }) => {
  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 20, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>
      </div>
    </header>
  );
};

export default Topbar;
