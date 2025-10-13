import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Stepper - horizontal steps indicator.
 */
export default function Stepper({ steps = [], current = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {steps.map((s, idx) => {
        const active = idx <= current;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999,
              background: active ? 'var(--color-primary)' : 'var(--border-color)',
              color: active ? '#fff' : 'var(--text-secondary)',
              display: 'grid', placeItems: 'center',
              boxShadow: active ? '0 0 0 2px var(--ring-color)' : 'none'
            }}>{idx + 1}</div>
            <span style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
            {idx !== steps.length - 1 && <div style={{ width: 40, height: 2, background: active ? 'var(--color-primary)' : 'var(--border-color)' }} />}
          </div>
        );
      })}
    </div>
  );
}
