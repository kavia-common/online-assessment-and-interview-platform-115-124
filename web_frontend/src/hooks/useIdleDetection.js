import { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useIdleDetection tracks idle state with a timeout and activity reset.
 */
export default function useIdleDetection(timeoutMs = 60_000, onIdle) {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const reset = () => {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIdle(true);
        if (typeof onIdle === 'function') onIdle();
      }, timeoutMs);
    };
    const events = ['mousemove', 'keydown', 'wheel', 'touchstart', 'touchmove'];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [timeoutMs, onIdle]);

  return { idle };
}
