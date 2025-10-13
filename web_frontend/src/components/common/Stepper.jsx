import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Stepper - Responsive stepper with mobile progress bar and ARIA semantics.
 */
export default function Stepper({ steps = [], current = 0, onStepClick }) {
  const total = steps.length || 1;
  const percentage = Math.round((current / (total - 1)) * 100);

  return (
    <div style={{ width: '100%' }}>
      {/* Mobile compact progress indicator */}
      <div className="show-on-mobile" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={isFinite(percentage) ? percentage : 0} aria-label="Step progress" style={{ marginBottom: 8 }}>
        <div style={{ height: 8, borderRadius: 999, background: 'var(--border-color)' }}>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--color-primary)', width: `${isFinite(percentage) ? percentage : 0}%` }} />
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }} aria-hidden="true">
          Step {current + 1} of {total}
        </div>
      </div>

      {/* Desktop: clickable step pills */}
      <div className="hide-on-mobile" role="list" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {steps.map((label, idx) => {
          const active = idx === current;
          const visited = idx <= current;
          return (
            <button
              key={`${label}-${idx}`}
              role="listitem"
              onClick={() => onStepClick?.(idx)}
              aria-current={active ? 'step' : undefined}
              aria-label={`Go to step ${idx + 1}: ${label}`}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: `1px solid ${visited ? 'var(--color-primary)' : 'var(--border-color)'}`,
                background: visited ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: visited ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
