import React from 'react';

const WS_URL = (typeof process !== 'undefined' && (process as any).env && (process as any).env.REACT_APP_WS_URL) || 'ws://localhost:3000/ws';

type Status = 'disconnected' | 'connecting' | 'connected';

let sharedStatus: Status = 'disconnected';
const subscribers = new Set<(s: Status) => void>();

function setStatus(s: Status) {
  sharedStatus = s;
  subscribers.forEach(cb => cb(s));
}

function simulate() {
  setStatus('connecting');
  const t1 = setTimeout(() => setStatus('connected'), 800);
  const t2 = setTimeout(() => setStatus('connected'), 2000);
  return () => { clearTimeout(t1); clearTimeout(t2); };
}

// PUBLIC_INTERFACE
export function useWebsocketStatus() {
  /**
   * Provides a placeholder websocket connection status. In production, replace with actual WS connection management using WS_URL.
   */
  const [status, set] = React.useState<Status>(sharedStatus);

  React.useEffect(() => {
    subscribers.add(set);
    const cleanup = simulate();
    return () => {
      subscribers.delete(set);
      cleanup();
    };
  }, []);

  return { status, WS_URL };
}
