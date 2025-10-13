import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Stepper with animated nodes and mobile progress bar fallback.
 */
const Stepper = ({ steps = [], current = 0 }) => {
  const percent = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

  return (
    <div className="stepper">
      {/* Mobile progress bar */}
      <div className="hidden-desktop" style={{ display: 'none' }}>
        <div style={{ height: 8, background: '#E5E7EB', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${percent}%`, background: 'var(--color-primary)', transition: `width var(--transition-normal) ease` }} />
        </div>
      </div>

      {/* Desktop nodes */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {steps.map((s, i) => {
          const active = i <= current;
          const currentNode = i === current;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 16,
                  background: active ? 'var(--color-primary)' : '#E5E7EB',
                  color: active ? '#fff' : '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentNode ? '0 0 0 3px rgba(37,99,235,0.25)' : 'none',
                  transition: `all var(--transition-normal) ease`,
                }}
                aria-current={currentNode ? 'step' : undefined}
              >
                {i + 1}
              </div>
              <div className="hidden-mobile" style={{ whiteSpace: 'nowrap' }}>{s}</div>
              {i < steps.length - 1 && (
                <div style={{ width: 32, height: 2, background: active ? 'var(--color-primary)' : '#E5E7EB', transition: `background var(--transition-normal) ease` }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hidden-desktop { display: block !important; margin-bottom: var(--space-3); }
        }
      `}</style>
    </div>
  );
};

export default Stepper;
