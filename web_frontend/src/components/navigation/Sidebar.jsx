import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar - responsive, collapsible navigation sidebar with ARIA attributes.
 */
export default function Sidebar({ title = 'Menu', items = [] }) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [location.pathname, isMobile]);

  const sidebar = (
    <aside
      id="primary-sidebar"
      role="navigation"
      aria-label="Primary navigation"
      className="sidebar"
      style={{
        position: isMobile ? 'fixed' : 'sticky',
        left: 0,
        top: 0,
        height: '100vh',
        width: isMobile ? 288 : 256,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 200ms ease',
        zIndex: 950,
      }}
    >
      <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              marginLeft: 'auto',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>
      <nav style={{ padding: 8, display: 'grid', gap: 6 }}>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            style={({ isActive }) => ({
              padding: '10px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
              background: 'var(--bg-surface)',
              boxShadow: isActive ? '0 0 0 2px var(--ring-color)' : 'var(--shadow-sm)',
            })}
            aria-label={`Navigate to ${it.label}`}
          >
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>
        Ocean Professional
      </div>
    </aside>
  );

  return (
    <>
      <button
        className="show-on-mobile"
        aria-label={`${open ? 'Close' : 'Open'} navigation menu`}
        aria-expanded={open}
        aria-controls="primary-sidebar"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 960,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          borderRadius: 8,
          padding: '8px 10px',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>
      {sidebar}
      {isMobile && open && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 940,
          }}
        />
      )}
    </>
  );
}
