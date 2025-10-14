/**
 * Event logger hook buffers anti-cheat events and pushes to backend.
 * When WS available, it also streams events for live proctoring.
 */
import { useCallback, useEffect, useRef } from 'react';
import { apiClient } from '../services/apiClient';
import { endpoints } from '../services/endpoints';
import { createEventsWS } from '../services/ws';
import env from '../config/env';

type ProctorEvent = {
  type: string;
  ts: number;
  meta?: Record<string, any>;
};

const FLUSH_INTERVAL = 3000;
const MAX_BUFFER = 25;

// PUBLIC_INTERFACE
export function useEventLogger(sessionId?: string) {
  /** Returns logEvent method that buffers and transmits events. */
  const bufferRef = useRef<ProctorEvent[]>([]);
  const wsRef = useRef<ReturnType<typeof createEventsWS> | null>(null);

  const flush = useCallback(async () => {
    const buf = bufferRef.current;
    if (!buf.length) return;
    const toSend = buf.splice(0, buf.length);
    try {
      await apiClient.post(endpoints.events.bulk(), {
        session_id: sessionId || null,
        events: toSend,
      });
    } catch {
      // put back on failure (best-effort)
      bufferRef.current.unshift(...toSend);
    }
  }, [sessionId]);

  const logEvent = useCallback((type: string, meta?: Record<string, any>) => {
    const ev: ProctorEvent = { type, ts: Date.now(), meta: meta || {} };
    bufferRef.current.push(ev);
    // WS stream if connected
    if (wsRef.current) {
      try {
        wsRef.current.send({ kind: 'proctor_event', sessionId, ...ev });
      } catch {
        // ignore
      }
    }
    if (bufferRef.current.length >= MAX_BUFFER) {
      flush();
    }
  }, [flush, sessionId]);

  useEffect(() => {
    const t = setInterval(flush, FLUSH_INTERVAL);
    if (!wsRef.current) {
      const ws = createEventsWS();
      ws.connect();
      wsRef.current = ws;
    }
    return () => {
      clearInterval(t);
      flush();
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [flush]);

  return { logEvent };
}

export default useEventLogger;
