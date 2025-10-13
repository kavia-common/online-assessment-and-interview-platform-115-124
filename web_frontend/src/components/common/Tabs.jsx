import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Tabs - minimal tabs component.
 */
export default function Tabs({ items = [], onChange }) {
  const [active, setActive] = useState(items[0]?.key);

  const handle = (k) => {
    setActive(k);
    onChange && onChange(k);
  };

  const current = items.find(i => i.key === active);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)' }}>
        {items.map(i => (
          <button key={i.key} onClick={() => handle(i.key)} style={{
            padding: '10px 12px',
            border: 'none',
            borderBottom: `2px solid ${i.key === active ? 'var(--color-primary)' : 'transparent'}`,
            background: 'transparent',
            color: i.key === active ? 'var(--color-primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}>{i.label}</button>
        ))}
      </div>
      <div className="mt-16">
        {current?.content}
      </div>
    </div>
  );
}
