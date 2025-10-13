import { apiClient } from './apiClient';
import { createWS } from './websocket';

/**
 * PUBLIC_INTERFACE
 * hrService - mock service for HR setup and workflows including:
 * TestConfig, PatternConfig, BulkUpload, Assignment, EmailTriggers,
 * LiveMonitor, TimeAdjustment, ReappearRequests, Results list/filters/export,
 * and AssignToEmployee. Uses mocked apiClient for now.
 */
export const hrService = {
  // PUBLIC_INTERFACE
  async getTestConfigs() {
    /** Returns list of test configurations. */
    const res = await apiClient.get('/hr/tests/configs');
    return (
      res.data?.items || [
        { id: 'cfg1', name: 'Aptitude L1', duration: 45, sections: 2, status: 'Active' },
        { id: 'cfg2', name: 'Frontend L1', duration: 60, sections: 3, status: 'Draft' },
      ]
    );
  },

  // PUBLIC_INTERFACE
  async saveTestConfig(payload) {
    /** Create/update a test config. */
    await apiClient.post('/hr/tests/configs', payload);
    return { success: true, id: payload.id || 'cfg_' + Math.random().toString(36).slice(2, 8) };
  },

  // PUBLIC_INTERFACE
  async getPatterns() {
    /** Returns list of question patterns/mapping rules. */
    await apiClient.get('/hr/tests/patterns');
    return [
      { id: 'pat1', name: 'MCQ Heavy', rules: 'MCQ 80%, Theory 20%' },
      { id: 'pat2', name: 'Balanced', rules: 'MCQ 60%, Theory 40%' },
    ];
  },

  // PUBLIC_INTERFACE
  async savePattern(payload) {
    /** Save pattern rule set. */
    await apiClient.post('/hr/tests/patterns', payload);
    return { success: true };
  },

  // PUBLIC_INTERFACE
  async bulkUploadCandidates(fileMeta) {
    /** Uploads candidate list (mocked). */
    await apiClient.post('/hr/candidates/bulk', fileMeta || {});
    return { success: true, imported: 120, duplicates: 3 };
  },

  // PUBLIC_INTERFACE
  async listAssignments() {
    /** Returns current candidate-to-test assignments. */
    await apiClient.get('/hr/assignments');
    return [
      { id: 'as1', candidate: 'Alex P.', test: 'Frontend L1', due: '2025-11-15', status: 'Assigned' },
      { id: 'as2', candidate: 'Sam K.', test: 'Aptitude', due: '2025-11-12', status: 'Completed' },
    ];
  },

  // PUBLIC_INTERFACE
  async assignCandidate(payload) {
    /** Assign a candidate to a test. */
    await apiClient.post('/hr/assignments', payload);
    return { success: true };
  },

  // PUBLIC_INTERFACE
  async triggerEmails(payload) {
    /** Trigger email notifications (mock). */
    await apiClient.post('/hr/emails/triggers', payload);
    return { success: true, count: (payload?.recipients || []).length || 0 };
  },

  // PUBLIC_INTERFACE
  subscribeLiveMonitor(batchId, onMessage) {
    /**
     * PUBLIC_INTERFACE
     * subscribeLiveMonitor opens a WebSocket for real-time test events for a batch.
     * Returns a close function.
     */
    const ws = createWS('/ws/hr/live', { batchId });
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        onMessage?.(data);
      } catch {
        onMessage?.({ type: 'raw', payload: evt.data });
      }
    };
    ws.onerror = () => {
      onMessage?.({ type: 'error', payload: 'WebSocket error' });
    };
    ws._onclose = () => {
      onMessage?.({ type: 'info', payload: 'Disconnected' });
    };
    return () => ws.closeGracefully?.();
  },

  // PUBLIC_INTERFACE
  async adjustTime(attemptId, minutes) {
    /** Grant extra time to a candidate attempt. */
    await apiClient.post(`/hr/attempts/${attemptId}/adjust-time`, { minutes });
    return { success: true };
  },

  // PUBLIC_INTERFACE
  async listReappearRequests() {
    /** List reappear/retake requests. */
    await apiClient.get('/hr/reappear');
    return [
      { id: 'ra1', candidate: 'Chris T.', test: 'Frontend L1', reason: 'Network issue', status: 'Pending' },
      { id: 'ra2', candidate: 'Jamie L.', test: 'Aptitude', reason: 'Device crash', status: 'Approved' },
    ];
  },

  // PUBLIC_INTERFACE
  async processReappear(id, action) {
    /** Approve/Reject a reappear request. */
    await apiClient.post(`/hr/reappear/${id}`, { action });
    return { success: true, status: action === 'approve' ? 'Approved' : 'Rejected' };
  },

  // PUBLIC_INTERFACE
  async listResults(filters = {}) {
    /** Returns results with basic fields. */
    await apiClient.get('/hr/results');
    const base = [
      { id: 'rs1', candidate: 'Alex P.', test: 'Frontend L1', score: 78, status: 'Passed', date: '2025-10-18' },
      { id: 'rs2', candidate: 'Sam K.', test: 'Aptitude', score: 62, status: 'Passed', date: '2025-10-16' },
      { id: 'rs3', candidate: 'Taylor Q.', test: 'Frontend L1', score: 42, status: 'Failed', date: '2025-10-12' },
    ];
    const { status = 'all', query = '' } = filters;
    const s = String(query).toLowerCase();
    return base.filter((r) => {
      const okStatus = status === 'all' || r.status === status;
      const okText = !s || r.candidate.toLowerCase().includes(s) || r.test.toLowerCase().includes(s);
      return okStatus && okText;
    });
  },

  // PUBLIC_INTERFACE
  async exportResults(filters = {}) {
    /** Placeholder export - returns mock blob URL string. */
    await apiClient.post('/hr/results/export', filters);
    return { success: true, url: 'blob:results-' + Date.now() };
  },

  // PUBLIC_INTERFACE
  async listEmployees() {
    /** List employees for assignment. */
    await apiClient.get('/hr/employees');
    return [
      { id: 'e1', name: 'Evan Employee' },
      { id: 'e2', name: 'Priya Reviewer' },
      { id: 'e3', name: 'Diego Analyst' },
    ];
  },

  // PUBLIC_INTERFACE
  async assignToEmployee(payload) {
    /** Assign candidates or results to an employee for review. */
    await apiClient.post('/hr/assign-to-employee', payload);
    return { success: true };
  },
};
