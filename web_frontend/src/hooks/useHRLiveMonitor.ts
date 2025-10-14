import { useEffect, useRef, useState } from 'react';
import { createHRLiveWS } from '../services/ws';

type LiveEvent = {
  type: string;
  ts: number;
  userId?: string;
  attemptId?: string;
  sessionId?: string;
  meta?: Record<string, any>;
};

// PUBLIC_INTERFACE
export function useHRLiveMonitor() {
  /** Subscribes to HR live WS and returns list of recent events. */
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const wsRef = useRef<ReturnType<typeof createHRLiveWS> | null>(null);

  useEffect(() => {
    const ws = createHRLiveWS();
    ws.connect();
    wsRef.current = ws;
    const unsub = ws.subscribe((msg: any) => {
      const ev = (msg && msg.type) ? msg : { type: 'message', ts: Date.now(), meta: msg };
      setEvents((prev) => [ev as LiveEvent, ...prev].slice(0, 200));
    });

    return () => {
      unsub();
      ws.disconnect();
      wsRef.current = null;
    };
  }, []);

  return { events };
}

export default useHRLiveMonitor;
