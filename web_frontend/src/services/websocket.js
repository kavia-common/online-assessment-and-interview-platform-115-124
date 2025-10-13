import { getEnv } from '../config/env';

// PUBLIC_INTERFACE
export function createWS(path, params = {}) {
  /**
   * PUBLIC_INTERFACE
   * createWS creates a WebSocket connection prefixed with the WS base URL.
   * Params are encoded as query string.
   */
  const { wsBase } = getEnv();
  const qs = new URLSearchParams(params).toString();
  const base = path.startsWith('/') ? path : `/${path}`;
  const url = `${wsBase}${base}${qs ? `?${qs}` : ''}`;

  // Basic connect
  let ws = new WebSocket(url);

  // Basic reconnect stub
  let closedByUser = false;
  let retries = 0;
  const maxRetries = 3;

  function reconnect() {
    if (closedByUser || retries >= maxRetries) return;
    retries += 1;
    ws = new WebSocket(url);
    // Reattach simple handlers if needed by caller; for now the caller
    // should re-bind events after receiving onclose.
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
    try { ws.close(); } catch { /* noop */ }
  };

  return ws;
}
