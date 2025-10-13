import { apiClient } from './apiClient';
import { HR, TESTS } from './endpoints';
import { createWS } from './websocket';

/**
 * PUBLIC_INTERFACE
 * hrApi - HR workflows mapping to centralized endpoints.
 */
export const hrApi = {
  // PUBLIC_INTERFACE
  async getTestConfigs() {
    const res = await apiClient.get(TESTS.CONFIGS);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async saveTestConfig(payload) {
    const res = await apiClient.post(TESTS.CONFIGS, payload);
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async getPatterns() {
    const res = await apiClient.get(TESTS.PATTERNS);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async savePattern(payload) {
    const res = await apiClient.post(TESTS.PATTERNS, payload);
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async bulkUploadCandidates(fileMeta) {
    const res = await apiClient.post(HR.CANDIDATES_BULK, fileMeta);
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async listAssignments() {
    const res = await apiClient.get(TESTS.ASSIGNMENTS);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async assignCandidate(payload) {
    const res = await apiClient.post(TESTS.ASSIGNMENTS, payload);
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async triggerEmails(payload) {
    const res = await apiClient.post(HR.EMAIL_TRIGGERS, payload);
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  subscribeLiveMonitor(batchId, onMessage) {
    const ws = createWS(HR.LIVE_WS, { batchId });
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        onMessage?.(data);
      } catch {
        onMessage?.({ type: 'raw', payload: evt.data });
      }
    };
    ws.onerror = () => onMessage?.({ type: 'error', payload: 'WebSocket error' });
    ws._onclose = () => onMessage?.({ type: 'info', payload: 'Disconnected' });
    return () => ws.closeGracefully?.();
  },

  // PUBLIC_INTERFACE
  async adjustTime(attemptId, minutes) {
    const res = await apiClient.post(TESTS.ATTEMPT_ADJUST_TIME(attemptId), { minutes });
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async listReappearRequests() {
    const res = await apiClient.get(HR.REAPPEAR);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async processReappear(id, action) {
    const res = await apiClient.post(HR.REAPPEAR_DETAIL(id), { action });
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async listResults(filters = {}) {
    const res = await apiClient.get(TESTS.RESULTS, { params: filters });
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async exportResults(filters = {}) {
    const res = await apiClient.post(TESTS.RESULTS_EXPORT, filters);
    return res.data || { success: true };
  },

  // PUBLIC_INTERFACE
  async listEmployees() {
    const res = await apiClient.get(HR.EMPLOYEES);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async assignToEmployee(payload) {
    const res = await apiClient.post(HR.ASSIGN_TO_EMPLOYEE, payload);
    return res.data || { success: true };
  },
};
