import { apiClient } from './apiClient';
import { CHAT } from './endpoints';

/**
 * PUBLIC_INTERFACE
 * chatService - simple chat API wrapper.
 */
export const chatService = {
  // PUBLIC_INTERFACE
  async listThreads() {
    const res = await apiClient.get(CHAT.THREADS);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async listMessages(threadId) {
    const res = await apiClient.get(CHAT.MESSAGES(threadId));
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async sendMessage(threadId, payload) {
    const res = await apiClient.post(CHAT.MESSAGES(threadId), payload);
    return res.data;
  },
};
