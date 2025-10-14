/**
 * Chat service to load history via REST and stream realtime via WS.
 */
import { apiClient } from './apiClient';
import { endpoints } from './endpoints';
import { createChatWS } from './ws';

let wsInstance = null;

// PUBLIC_INTERFACE
export function getChatWS() {
  if (!wsInstance) {
    wsInstance = createChatWS();
    wsInstance.connect();
  }
  return wsInstance;
}

// PUBLIC_INTERFACE
export async function fetchChatHistory(channel = 'general') {
  return apiClient.get(endpoints.chat.history(channel));
}

// PUBLIC_INTERFACE
export function sendChatMessage(message, channel = 'general') {
  const ws = getChatWS();
  ws.send({ action: 'message', channel, message });
}

export default { getChatWS, fetchChatHistory, sendChatMessage };
