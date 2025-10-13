import React, { useEffect, useMemo, useRef, useState } from 'react';
import useClipboardBlock from '../../hooks/useClipboardBlock';
import useTabVisibility from '../../hooks/useTabVisibility';
import useIdleDetection from '../../hooks/useIdleDetection';
import Tag from '../common/Tag';
import { createWS } from '../../services/websocket';

/**
 * PUBLIC_INTERFACE
 * AntiCheatGuard tracks tab switches, idle state and blocks clipboard actions.
 * It renders a small status bar and notifies parent through callbacks.
 * Additionally, it buffers and sends anti-cheat events to /ws/events?attemptId=<id>
 * using a debounced/backpressured websocket sender with in-memory retry.
 */
export default function AntiCheatGuard({
  children,
  onTabHidden,
  onIdle,
  attemptId,
  clipboardBlock = true,
  idleTimeoutMs = 90_000,
  flushIntervalMs = 2000,
  maxBuffer = 50,
}) {
  const [events, setEvents] = useState([]);
  const queueRef = useRef([]);
  const sendingRef = useRef(false);
  const wsRef = useRef(null);

  // Initialize websocket channel when attemptId is provided
  useEffect(() => {
    if (!attemptId) return;
    const wsApi = createWS('/ws/events', { attemptId });
    wsRef.current = wsApi;

    return () => {
      try { wsApi?.closeGracefully(); } catch { /* noop */ }
      wsRef.current = null;
    };
  }, [attemptId]);

  // Helpers
  const enqueue = (evt) => {
    queueRef.current.push(evt);
    // Trim if too large
    if (queueRef.current.length > maxBuffer) {
      queueRef.current.splice(0, queueRef.current.length - maxBuffer);
    }
  };

  const flush = () => {
    if (!queueRef.current.length) return;
    // Try to send as a batch to minimize WS messages
    const batch = queueRef.current.splice(0, queueRef.current.length);
    const payload = { type: 'anti-cheat-events', items: batch };
    const ok = wsRef.current?.sendSafe ? wsRef.current.sendSafe(payload) : false;
    if (!ok) {
      // Put them back to the front for retry later
      queueRef.current.unshift(...batch);
    }
  };

  // Periodic flush timer (debounce/backpressure)
  useEffect(() => {
    const id = setInterval(() => {
      if (sendingRef.current) return;
      sendingRef.current = true;
      try { flush(); } finally { sendingRef.current = false; }
    }, flushIntervalMs);
    return () => clearInterval(id);
  }, [flushIntervalMs]);

  useClipboardBlock(clipboardBlock);
  const { isHidden, hiddenCount } = useTabVisibility(() => {
    const evt = { type: 'tab-hidden', t: Date.now() };
    setEvents((e) => [evt, ...e].slice(0, 20));
    enqueue(evt);
    if (typeof onTabHidden === 'function') onTabHidden((hiddenCount || 0) + 1);
  });
  const { idle } = useIdleDetection(idleTimeoutMs, () => {
    const evt = { type: 'idle', t: Date.now() };
    setEvents((e) => [evt, ...e].slice(0, 20));
    enqueue(evt);
    if (typeof onIdle === 'function') onIdle();
  });

  useEffect(() => {
    const onBlur = () => {
      const evt = { type: 'window-blur', t: Date.now() };
      setEvents((e) => [evt, ...e].slice(0, 20));
      enqueue(evt);
    };
    const onFocus = () => {
      const evt = { type: 'window-focus', t: Date.now() };
      setEvents((e) => [evt, ...e].slice(0, 20));
      enqueue(evt);
    };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const statusTag = useMemo(() => {
    const connected = Boolean(wsRef.current);
    return connected ? <Tag color="success">Live</Tag> : <Tag color="warning">Offline</Tag>;
  }, [wsRef.current]);

  return (
    <div>
      <div className="card p-16" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Tag color={isHidden ? 'warning' : 'primary'}>{isHidden ? 'Tab not visible' : 'Tab active'}</Tag>
        <Tag color={idle ? 'error' : 'success'}>{idle ? 'Idle detected' : 'Active'}</Tag>
        {statusTag}
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
