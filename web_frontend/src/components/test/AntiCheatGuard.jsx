import React, { useEffect, useState } from 'react';
import useClipboardBlock from '../../hooks/useClipboardBlock';
import useTabVisibility from '../../hooks/useTabVisibility';
import useIdleDetection from '../../hooks/useIdleDetection';
import Tag from '../common/Tag';

/**
 * PUBLIC_INTERFACE
 * AntiCheatGuard tracks tab switches, idle state and blocks clipboard actions.
 * It renders a small status bar and notifies parent through callbacks.
 */
export default function AntiCheatGuard({
  children,
  onTabHidden,
  onIdle,
  clipboardBlock = true,
  idleTimeoutMs = 90_000,
}) {
  const [events, setEvents] = useState([]);
  useClipboardBlock(clipboardBlock);
  const { isHidden, hiddenCount } = useTabVisibility(() => {
    setEvents((e) => [{ type: 'tab-hidden', t: Date.now() }, ...e].slice(0, 20));
    if (typeof onTabHidden === 'function') onTabHidden(hiddenCount + 1);
  });
  const { idle } = useIdleDetection(idleTimeoutMs, () => {
    setEvents((e) => [{ type: 'idle', t: Date.now() }, ...e].slice(0, 20));
    if (typeof onIdle === 'function') onIdle();
  });

  useEffect(() => {
    const onBlur = () => setEvents((e) => [{ type: 'window-blur', t: Date.now() }, ...e].slice(0, 20));
    const onFocus = () => setEvents((e) => [{ type: 'window-focus', t: Date.now() }, ...e].slice(0, 20));
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <div>
      <div className="card p-16" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Tag color={isHidden ? 'warning' : 'success'}>{isHidden ? 'Tab not visible' : 'Tab active'}</Tag>
        <Tag color={idle ? 'error' : 'primary'}>{idle ? 'Idle detected' : 'Active'}</Tag>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
          Switches: {hiddenCount}
        </span>
      </div>
      {children}
      <div className="mt-16" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        Recent events: {events.map((e, idx) => <span key={idx} style={{ marginRight: 6 }}>{e.type}</span>)}
      </div>
    </div>
  );
}
