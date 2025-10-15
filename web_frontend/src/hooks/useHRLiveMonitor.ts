import { useEffect, useMemo, useRef, useState } from 'react';
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
export default function useHRLiveMonitor() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const wsRef = useRef<ReturnType<typeof createHRLiveWS> | null>(null);

  useEffect(() => {
    const ws = createHRLiveWS();
    wsRef.current = ws;
    const unsub = ws.subscribe((msg: any) => {
      const ev = (msg && msg.type) ? msg : { type: 'message', ts: Date.now(), meta: msg };
      setEvents((prev) => [ev as LiveEvent, ...prev].slice(0, 500));
    });

    return () => {
      unsub();
      ws.disconnect();
      wsRef.current = null;
    };
  }, []);

  const api = useMemo(() => ({
    clear: () => setEvents([]),
  }), []);

  return { events, ...api };
}

// PUBLIC_INTERFACE
export const useHRLiveMonitor = (...args: any[]) => {
  // Backward-compatible named export
  // @ts-ignore
  return (useHRLiveMonitor as any)(...args);
};
