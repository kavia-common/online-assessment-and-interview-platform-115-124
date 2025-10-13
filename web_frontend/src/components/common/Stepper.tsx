import React from 'react';
import '../../styles/theme.css';

export type Step = { key: string; label: string; };

type Props = {
  steps: Step[];
  activeIndex: number;
};

/**
 * Stepper shows linear progression with active step.
 */
const Stepper: React.FC<Props> = ({ steps, activeIndex }) => {
  return (
    <div aria-label="Progress steps" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {steps.map((s, idx) => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            className="badge"
            aria-current={idx === activeIndex ? 'step' : undefined}
            style={{
              background: idx === activeIndex ? 'rgba(37,99,235,0.2)' : 'rgba(17,24,39,0.06)',
              color: idx === activeIndex ? 'var(--color-primary)' : '#374151',
            }}
          >
            {idx + 1}
            <span>{s.label}</span>
          </div>
          {idx < steps.length - 1 && <div style={{ width: 24, height: 2, background: 'rgba(17,24,39,0.08)' }} />}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
