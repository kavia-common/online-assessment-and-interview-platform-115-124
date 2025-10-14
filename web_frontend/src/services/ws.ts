/**
 * WebSocket client with token injection, auto-reconnect, and pub/sub.
 */
import env from '../config/env';
import { wsEndpoints } from './endpoints';

type MessageHandler = (data: any) => void;

type ChannelConfig = {
  url: string;
  protocols?: string | string[];
};

class WSClient {
  private socket: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 10000; // 10s

  constructor(cfg: ChannelConfig) {
    this.url = cfg.url;
  }

  private buildUrlWithToken(baseUrl: string) {
    const token = localStorage.getItem('auth_token');
    const u = new URL(baseUrl);
    if (token) u.searchParams.set('token', token);
    return u.toString();
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
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
      this.reconnect();
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
      // bufferless simple retry after short delay
      setTimeout(() => {
        if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(payload);
      }, 500);
    }
  }

  // PUBLIC_INTERFACE
  disconnect() {
    /** Close socket and stop reconnecting. */
    this.reconnectAttempts = 0;
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }
    this.socket = null;
  }
}

// PUBLIC_INTERFACE
export function createChatWS() {
  const url = wsEndpoints.chat(env.WS_BASE_URL);
  return new WSClient({ url });
}

// PUBLIC_INTERFACE
export function createEventsWS() {
  const url = wsEndpoints.events(env.WS_BASE_URL);
  return new WSClient({ url });
}

// PUBLIC_INTERFACE
export function createHRLiveWS() {
  const url = wsEndpoints.hrLive(env.WS_BASE_URL);
  return new WSClient({ url });
}

export default WSClient;
