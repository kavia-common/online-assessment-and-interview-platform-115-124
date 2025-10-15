/**
 * WebSocket client with token injection, auto-reconnect, and simple pub/sub.
 */
import env from '../config/env';
import { wsEndpoints } from './endpoints';

type MessageHandler = (data: any) => void;

type ChannelConfig = {
  url: string;
};

class WSClient {
  private socket: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 10000; // 10s
  private closedManually = false;

  constructor(cfg: ChannelConfig) {
    this.url = cfg.url;
  }

  private buildUrlWithToken(baseUrl: string) {
    const token = (() => {
      try { return localStorage.getItem('auth_token') || localStorage.getItem('token'); } catch { return null; }
    })();
    const u = new URL(baseUrl);
    if (token) u.searchParams.set('token', token);
    return u.toString();
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.closedManually = false;
    const url = this.buildUrlWithToken(this.url);
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
    };
    this.socket.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        this.handlers.forEach(h => h(data));
      } catch {
        this.handlers.forEach(h => h(evt.data));
      }
    };
    this.socket.onclose = () => {
      if (!this.closedManually) this.reconnect();
    };
    this.socket.onerror = () => {
      try { this.socket?.close(); } catch {}
    };
  }

  private reconnect() {
    this.reconnectAttempts += 1;
    const delay = Math.min(this.maxReconnectDelay, 500 * this.reconnectAttempts);
    setTimeout(() => this.connect(), delay);
  }

  // PUBLIC_INTERFACE
  subscribe(handler: MessageHandler) {
    /** Subscribe to incoming WS messages. Returns unsubscribe fn. */
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  // PUBLIC_INTERFACE
  send(data: any) {
    /** Send a message to the server via WS. If not open, attempt reconnect. */
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
    } else {
      this.connect();
      setTimeout(() => {
        if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(payload);
      }, 500);
    }
  }

  // PUBLIC_INTERFACE
  disconnect() {
    /** Close socket and stop reconnecting. */
    this.reconnectAttempts = 0;
    this.closedManually = true;
    if (this.socket) {
      try { this.socket.onclose = null; } catch {}
      try { this.socket.close(); } catch {}
    }
    this.socket = null;
  }
}

// PUBLIC_INTERFACE
export function createChatWS() {
  const url = wsEndpoints.chat(env.WS_BASE_URL);
  const ws = new WSClient({ url });
  ws.connect();
  return ws;
}

// PUBLIC_INTERFACE
export function createEventsWS() {
  const url = wsEndpoints.events(env.WS_BASE_URL);
  const ws = new WSClient({ url });
  ws.connect();
  return ws;
}

// PUBLIC_INTERFACE
export function createHRLiveWS() {
  const url = wsEndpoints.hrLive(env.WS_BASE_URL);
  const ws = new WSClient({ url });
  ws.connect();
  return ws;
}

// PUBLIC_INTERFACE
export function useWebsocketStatus() {
  // simple mock status hook to avoid unused re-exports; could be wired to WS state
  return { status: 'connected' as const };
}

export default WSClient;
