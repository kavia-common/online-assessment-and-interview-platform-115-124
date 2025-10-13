import { getEnv } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * createWS creates a WebSocket connection prefixed with the WS base URL.
 * Params are encoded as query string.
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

  // Basic connect
  let ws = new WebSocket(url);

  // Basic reconnect stub
  let closedByUser = false;
  let retries = 0;
  const maxRetries = 3;

  function reconnect() {
    if (closedByUser || retries >= maxRetries) return;
    retries += 1;
    try {
      ws = new WebSocket(url);
    } catch {
      // ignore
    }
  }

  ws.onclose = (evt) => {
    if (!closedByUser) {
      setTimeout(reconnect, 500 * (retries + 1));
    }
    if (typeof ws._onclose === 'function') ws._onclose(evt);
  };

  // Provide a close wrapper to avoid auto-reconnect
  ws.closeGracefully = () => {
    closedByUser = true;
    try {
      ws.close();
    } catch {
      /* noop */
    }
  };

  return ws;
}

/**
 * PUBLIC_INTERFACE
 * useEmployeeChatSocket (adapter)
 * A lightweight adapter to send chat messages for employee chat context.
 * Not a React hook to avoid hook rules in services.
 *
 * Usage:
 *  const { socketConnected, sendMessage } = useEmployeeChatSocket({ room: 'hr', onMessage: cb });
 */
export function useEmployeeChatSocket({ room, onMessage } = {}) {
  let socket = createWS('/chat', { room });
  let connected = !!socket;

  if (socket) {
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage && onMessage(data);
      } catch {
        // eslint-disable-next-line no-console
        console.warn('Non-JSON message received');
      }
    };
  }

  const sendMessage = (targetRoom, text) => {
    if (!socket) return;
    try {
      const payload = { type: 'message', room: targetRoom || room, text };
      socket.send(JSON.stringify(payload));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to send WS message', e);
    }
  };

  return {
    socketConnected: connected,
    sendMessage,
  };
}
