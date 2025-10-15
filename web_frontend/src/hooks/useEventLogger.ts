import { useCallback, useEffect, useMemo, useRef } from 'react';
import apiClient from '../services/apiClient';
import { endpoints } from '../services/endpoints';
import { createHRLiveWS } from '../services/ws';

type EventPayload = Record<string, any>;

type LoggerOptions = {
  sessionId?: string;
  enableWSStream?: boolean;
};

const MAX_BUFFER = 50;
const FLUSH_INTERVAL_MS = 3000;

// PUBLIC_INTERFACE
export default function useEventLogger(options: LoggerOptions = {}) {
  const { sessionId, enableWSStream = true } = options;
  const bufferRef = useRef<any[]>([]);
  const timerRef = useRef<any>(null);
  const wsRef = useRef<ReturnType<typeof createHRLiveWS> | null>(null);

  const ensureWS = useCallback(() => {
    if (!enableWSStream) return;
    if (wsRef.current) return;
    wsRef.current = createHRLiveWS();
  }, [enableWSStream]);

  const flush = useCallback(async () => {
    if (!bufferRef.current.length) return;
    const events = bufferRef.current.splice(0, bufferRef.current.length);
    try {
      await apiClient.post(endpoints.events.bulk(), { sessionId, events });
    } catch (e) {
      // If failed, requeue once to avoid losing data completely
      bufferRef.current.unshift(...events);
    }
  }, [sessionId]);

  useEffect(() => {
    ensureWS();
    timerRef.current = setInterval(flush, FLUSH_INTERVAL_MS);
    return () => {
      clearInterval(timerRef.current);
      flush();
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [flush, ensureWS]);

  const log = useCallback((type: string, payload: EventPayload = {}) => {
    const evt = { type, payload, ts: Date.now(), sessionId };
    bufferRef.current.push(evt);
    try {
      wsRef.current?.send({ kind: 'proctor_event', data: evt });
    } catch {}
    if (bufferRef.current.length >= MAX_BUFFER) {
      flush();
    }
  }, [sessionId, flush]);

  return useMemo(() => ({ log, flush }), [log, flush]);
}

// PUBLIC_INTERFACE
export const useEventLogger = (...args: any[]) => {
  // Backward-compatible named export
  // @ts-ignore
  return (useEventLogger as any)(...args);
};
