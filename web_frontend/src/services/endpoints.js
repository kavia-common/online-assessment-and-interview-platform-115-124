/**
 * Centralized REST endpoints aligned with backend FastAPI routes under /api/v1.
 * All items are functions to allow safe concatenation or query construction.
 */
export const API_PREFIX = '/api/v1';

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

  // hr
  hr: {
    config: () => `${API_PREFIX}/hr/config`,
    results: () => `${API_PREFIX}/hr/results`,
    export: () => `${API_PREFIX}/hr/export`,
    adjustTime: (attemptId) => `${API_PREFIX}/hr/attempts/${attemptId}/adjust-time`,
    reappear: (candidateId) => `${API_PREFIX}/hr/candidates/${candidateId}/reappear`,
    subscribe: () => `${API_PREFIX}/hr/monitor/subscribe`,
    unsubscribe: () => `${API_PREFIX}/hr/monitor/unsubscribe`,
  },

  // candidate
  candidate: {
    profile: () => `${API_PREFIX}/candidate/profile`,
    attempts: () => `${API_PREFIX}/candidate/attempts`,
    startTest: (templateId) => `${API_PREFIX}/candidate/tests/${templateId}/start`,
    submitAnswer: (attemptId) => `${API_PREFIX}/candidate/attempts/${attemptId}/answer`,
    finishAttempt: (attemptId) => `${API_PREFIX}/candidate/attempts/${attemptId}/finish`,
    heartbeat: (attemptId) => `${API_PREFIX}/candidate/attempts/${attemptId}/heartbeat`,
  },

  // chat
  chat: {
    messages: () => `${API_PREFIX}/chat/messages`,
    historyWith: (withUserId) => `${API_PREFIX}/chat/history/${withUserId}`,
  },

  // events/proctoring
  events: {
    log: () => `${API_PREFIX}/events`,
    bulk: () => `${API_PREFIX}/events/bulk`,
  },

  // files
  files: {
    upload: () => `${API_PREFIX}/files/upload`,
    download: (id) => `${API_PREFIX}/files/${id}`,
  },
};

// PUBLIC_INTERFACE
export const wsEndpoints = {
  chat: (base) => `${base}/ws/chat`,
  events: (base) => `${base}/ws/events`,
  hrLive: (base) => `${base}/ws/hr/live`,
};

export default endpoints;
