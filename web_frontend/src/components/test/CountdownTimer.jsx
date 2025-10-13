import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * CountdownTimer counts down from provided seconds and calls onExpire/onComplete.
 */
export default function CountdownTimer({ seconds = 0, onExpire, onComplete }) {
  const [remaining, setRemaining] = useState(Math.max(0, seconds));
  const [announce, setAnnounce] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(Math.max(0, seconds));
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) return;
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          (typeof onExpire === 'function' ? onExpire : onComplete)?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onExpire, onComplete, remaining]);

  // Announce remaining minutes
  useEffect(() => {
    if (remaining % 60 === 0) {
      const mins = Math.floor(remaining / 60);
      const message = `${mins} minute${mins === 1 ? '' : 's'} remaining`;
      setAnnounce(message);
      const t = setTimeout(() => setAnnounce(''), 1500);
      return () => clearTimeout(t);
    }
  }, [remaining]);

  const mmss = useMemo(() => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remaining]);

  return (
    <div>
      <div
        aria-label="Time remaining"
        style={{
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          color: remaining < 30 ? 'var(--color-error)' : 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          minWidth: 64,
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {mmss}
      </div>
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}
