import React from 'react';
import { apiClient } from '../services/api';

type LoggerEvent = {
  t: number; // timestamp
  type: string;
  meta?: Record<string, any>;
  sessionId?: string;
  userId?: string;
};

type UseEventLoggerOpts = {
  attachGlobal?: boolean;
};

// PUBLIC_INTERFACE
export function useEventLogger(opts: UseEventLoggerOpts = {}) {
  /**
   * Hook to capture and buffer events. Provides flush, startSession, endSession.
   * If attachGlobal is true, global listeners for focus/blur/visibility/copy/paste/fullscreenchange are added.
   */
  const sessionRef = React.useRef<{ sessionId?: string; userId?: string }>({});
  const bufferRef = React.useRef<LoggerEvent[]>([]);
  const [bufferSize, setBufferSize] = React.useState(0);
  const isFlushing = React.useRef(false);

  const push = React.useCallback((type: string, meta?: Record<string, any>) => {
    const evt: LoggerEvent = {
      t: Date.now(),
      type,
      meta,
      sessionId: sessionRef.current.sessionId,
      userId: sessionRef.current.userId,
    };
    bufferRef.current.push(evt);
    setBufferSize(bufferRef.current.length);
  }, []);

  const startSession = React.useCallback((sessionId: string, userId: string) => {
    sessionRef.current = { sessionId, userId };
    push('session_start', { sessionId, userId });
  }, [push]);

  const endSession = React.useCallback(() => {
    push('session_end');
    sessionRef.current = {};
  }, [push]);

  const flush = React.useCallback(async () => {
    if (isFlushing.current) return;
    if (bufferRef.current.length === 0) return;
    isFlushing.current = true;
    try {
      const payload = bufferRef.current.slice();
      // Stub transport: POST /events (ignore response)
      await apiClient.post('/events', { events: payload });
      bufferRef.current = [];
      setBufferSize(0);
    } catch (e) {
      // basic retry/backoff placeholder
      setTimeout(() => { isFlushing.current = false; }, 1000);
      return;
    }
    isFlushing.current = false;
  }, []);

  React.useEffect(() => {
    if (!opts.attachGlobal) return;
    const onFocus = () => push('window_focus');
    const onBlur = () => push('window_blur');
    const onVisibility = () => push('visibility_change', { hidden: document.hidden });
    const onCopy = () => push('copy');
    const onPaste = () => push('paste');
    const onFs = () => push('fullscreen_change', { fs: !!document.fullscreenElement });

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('fullscreenchange', onFs);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, [opts.attachGlobal, push]);

  return {
    push,
    flush,
    startSession,
    endSession,
    bufferSize,
  };
}
