import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Topbar - app bar with title and action toolbar.
 */
export default function Topbar({ title = 'App', actions }) {
  return (
    <header className="topbar" role="banner" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 'var(--topbar-height)' }}>
      <h1 style={{ fontSize: 18, margin: 0 }}>{title}</h1>
      <div role="toolbar" aria-label="Page actions" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {actions}
      </div>
    </header>
  );
}
