import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar renders a simple role-based navigation.
 */
export default function Sidebar({ title = 'Menu', items = [] }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>
      </div>
      <nav style={{ padding: 8, display: 'grid', gap: 6 }}>
        {items.map((it) => {
          const isDisabled = it.disabled;
          const baseStyle = {
            padding: '10px 12px',
            borderRadius: '8px',
            color: isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: 'none',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
          };
        return isDisabled ? (
            <span key={it.to} style={{ ...baseStyle, opacity: 0.7, cursor: 'not-allowed' }}>
              {it.label}
            </span>
          ) : (
            <NavLink
              key={it.to}
              to={it.to}
              style={({ isActive }) => ({
                ...baseStyle,
                borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                boxShadow: isActive ? '0 0 0 2px var(--ring-color)' : 'var(--shadow-sm)',
              })}
            >
              {it.label}
            </NavLink>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>
        Ocean Professional
      </div>
    </div>
  );
}
