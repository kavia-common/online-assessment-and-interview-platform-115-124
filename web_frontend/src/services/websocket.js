import { getEnv } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * createWS creates a resilient WebSocket connection prefixed with the WS base URL.
 * - Builds URL from wsBase + path + query params
 * - Auto-reconnects with exponential backoff (jitter)
 * - Exposes sendSafe and closeGracefully helpers
 */
export function createWS(path, params = {}) {
  const { wsBase } = getEnv();
  const qs = new URLSearchParams(params).toString();
  const base = path?.startsWith('/') ? path : `/${path || ''}`;
  const url = `${wsBase || ''}${base}${qs ? `?${qs}` : ''}`;

  if (!wsBase) {
    // eslint-disable-next-line no-console
    console.warn('wsBase not configured in env. WebSocket features are offline.');
    return null;
  }

  let ws = null;
  let closedByUser = false;
  let attempts = 0;
  const maxAttempts = 10;
  const listeners = {
    message: [],
    open: [],
    close: [],
    error: [],
  };

  const notify = (type, evt) => {
    (listeners[type] || []).forEach((fn) => {
      try { fn(evt); } catch { /* noop */ }
    });
  };

  const connect = () => {
    try {
      ws = new WebSocket(url);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('WS construct failed', e);
      return;
    }

    ws.onopen = (evt) => {
      attempts = 0;
      notify('open', evt);
    };
    ws.onmessage = (evt) => notify('message', evt);
    ws.onerror = (evt) => notify('error', evt);
    ws.onclose = (evt) => {
      notify('close', evt);
      if (!closedByUser && attempts < maxAttempts) {
        attempts += 1;
        const backoff = Math.min(1000 * 2 ** attempts, 15000);
        const jitter = Math.random() * 250;
        setTimeout(connect, backoff + jitter);
      }
    };
  };

  connect();

  const api = {
    raw: () => ws,
    // PUBLIC_INTERFACE
    sendSafe(payload) {
      /** Send JSON-serializable payload if socket is open. Queues are not persisted here. */
      if (!ws || ws.readyState !== 1) return false;
      try {
        const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
        ws.send(data);
        return true;
      } catch {
        return false;
      }
    },
    // PUBLIC_INTERFACE
    subscribe(type, handler) {
      /** Subscribe to a WS event type: 'message' | 'open' | 'close' | 'error'. Returns unsubscribe. */
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(handler);
      return () => {
        listeners[type] = (listeners[type] || []).filter((h) => h !== handler);
      };
    },
    // PUBLIC_INTERFACE
    closeGracefully() {
      /** Close the socket and stop auto-reconnect. */
      closedByUser = true;
      try { ws && ws.close(); } catch { /* noop */ }
    },
  };

  return api;
}

/**
 * PUBLIC_INTERFACE
 * useEmployeeChatSocket (adapter)
 * Lightweight adapter for employee chat.
 */
export function useEmployeeChatSocket({ room, onMessage } = {}) {
  const socket = createWS('/chat', { room });
  let connected = false;

  if (socket) {
    socket.subscribe('open', () => { connected = true; });
    socket.subscribe('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage && onMessage(data);
      } catch {
        // eslint-disable-next-line no-console
        console.warn('Non-JSON message received');
      }
    });
  }

  const sendMessage = (targetRoom, text) => {
    if (!socket) return;
    socket.sendSafe({ type: 'message', room: targetRoom || room, text });
  };

  return {
    socketConnected: connected,
    sendMessage,
  };
}
