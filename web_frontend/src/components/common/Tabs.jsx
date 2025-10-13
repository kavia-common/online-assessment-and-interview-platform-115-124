import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tabs with animated indicator and accessible structure.
 */
const Tabs = ({ tabs = [], onChange, initialIndex = 0 }) => {
  const [active, setActive] = useState(initialIndex);
  const handleClick = (i) => {
    setActive(i);
    onChange && onChange(i);
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-orientation="horizontal" style={{ position: 'relative', display: 'flex', gap: 8, borderBottom: '1px solid var(--border)' }}>
        {tabs.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.label || i}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleClick(i)}
              style={{
                padding: '10px 12px',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--color-primary)' : 'inherit',
                position: 'relative',
                transition: `color var(--transition-normal) ease`,
              }}
            >
              <span>{t.label}</span>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  transition: `background var(--transition-normal) ease`,
                }}
              />
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 'var(--space-3)' }}>
        {tabs[active]?.content}
      </div>
    </div>
  );
};

export default Tabs;
