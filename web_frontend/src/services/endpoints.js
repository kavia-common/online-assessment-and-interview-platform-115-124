/**
 * Centralized REST endpoints aligned with backend FastAPI routes.
 * Keeps all path segments in one place.
 */
const API_PREFIX = '/api/v1';

// PUBLIC_INTERFACE
export const endpoints = {
  // health
  health: {
    liveness: () => `${API_PREFIX}/health/liveness`,
    readiness: () => `${API_PREFIX}/health/readiness`,
  },

  // auth
  auth: {
    login: () => `${API_PREFIX}/auth/login`,
    register: () => `${API_PREFIX}/auth/register`,
    me: () => `${API_PREFIX}/auth/me`,
    refresh: () => `${API_PREFIX}/auth/refresh`,
    logout: () => `${API_PREFIX}/auth/logout`,
  },

  // admin
  admin: {
    users: () => `${API_PREFIX}/admin/users`,
    user: (id) => `${API_PREFIX}/admin/users/${id}`,
    questions: () => `${API_PREFIX}/admin/questions`,
    question: (id) => `${API_PREFIX}/admin/questions/${id}`,
    templates: () => `${API_PREFIX}/admin/templates`,
    template: (id) => `${API_PREFIX}/admin/templates/${id}`,
    reports: () => `${API_PREFIX}/admin/reports`,
    backup: () => `${API_PREFIX}/admin/backup`,
    restore: () => `${API_PREFIX}/admin/restore`,
  },

  // hr
  hr: {
    dashboard: () => `${API_PREFIX}/hr/dashboard`,
    config: () => `${API_PREFIX}/hr/config`,
    uploadCandidates: () => `${API_PREFIX}/hr/candidates/upload`,
    candidates: () => `${API_PREFIX}/hr/candidates`,
    candidate: (id) => `${API_PREFIX}/hr/candidates/${id}`,
    attempts: () => `${API_PREFIX}/hr/attempts`,
    adjustTime: (attemptId) => `${API_PREFIX}/hr/attempts/${attemptId}/adjust-time`,
    reappear: (attemptId) => `${API_PREFIX}/hr/attempts/${attemptId}/reappear`,
    exportResults: () => `${API_PREFIX}/hr/results/export`,
    assignEmployee: (candidateId) => `${API_PREFIX}/hr/candidates/${candidateId}/assign`,
    events: () => `${API_PREFIX}/hr/events`,
  },

  // candidate
  candidate: {
    dashboard: () => `${API_PREFIX}/candidate/dashboard`,
    profile: () => `${API_PREFIX}/candidate/profile`,
    resume: () => `${API_PREFIX}/candidate/profile/resume`,
    interviews: () => `${API_PREFIX}/candidate/interviews`,
    tests: () => `${API_PREFIX}/candidate/tests`,
    startTest: (testId) => `${API_PREFIX}/candidate/tests/${testId}/start`,
    submitTest: (attemptId) => `${API_PREFIX}/candidate/attempts/${attemptId}/submit`,
    questions: (attemptId) => `${API_PREFIX}/candidate/attempts/${attemptId}/questions`,
    answer: (attemptId, questionId) =>
      `${API_PREFIX}/candidate/attempts/${attemptId}/questions/${questionId}/answer`,
  },

  // chat
  chat: {
    history: (channel = 'general') => `${API_PREFIX}/chat/history?channel=${encodeURIComponent(channel)}`,
    send: () => `${API_PREFIX}/chat/send`,
  },

  // events/proctoring
  events: {
    log: () => `${API_PREFIX}/events`,
    bulk: () => `${API_PREFIX}/events/bulk`,
  },
};

// PUBLIC_INTERFACE
export const wsEndpoints = {
  chat: (base) => `${base}/ws/chat`,
  events: (base) => `${base}/ws/events`,
  hrLive: (base) => `${base}/ws/hr/live`,
};

export default endpoints;
