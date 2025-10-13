import { getEnv } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * endpoints - Centralized API endpoint map using environment base URL.
 * NOTE: Keep only path segments here; apiClient prefixes apiBase.
 */
const { apiBase } = getEnv();

/** Utility to resolve full URLs if ever needed in special cases. */
// PUBLIC_INTERFACE
export function withBase(path) {
  /** Returns an absolute URL by prefixing the API base URL */
  if (!path) return apiBase;
  return path.startsWith('http') ? path : `${apiBase}${path}`;
}

export const AUTH = Object.freeze({
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/me',
});

export const USERS = Object.freeze({
  ROOT: '/admin/users',
  DETAIL: (id) => `/admin/users/${id}`,
});

export const REPORTS = Object.freeze({
  ROOT: '/admin/reports',
  EXPORT: (id) => `/admin/reports/${id}/export`,
});

export const TESTS = Object.freeze({
  ROOT: '/tests',
  TEMPLATES: '/admin/tests/templates',
  TEMPLATE_DETAIL: (id) => `/admin/tests/templates/${id}`,
  ASSIGNMENTS: '/hr/assignments',
  CONFIGS: '/hr/tests/configs',
  PATTERNS: '/hr/tests/patterns',
  ATTEMPT_ADJUST_TIME: (attemptId) => `/hr/attempts/${attemptId}/adjust-time`,
  RESULTS: '/hr/results',
  RESULTS_EXPORT: '/hr/results/export',
});

export const QUESTIONS = Object.freeze({
  ROOT: '/admin/questions',
  DETAIL: (id) => `/admin/questions/${id}`,
  IMPORT: '/admin/questions/import',
  EXPORT: '/admin/questions/export',
});

export const CANDIDATE = Object.freeze({
  PROFILE: '/candidate/profile',
  RESUME: '/candidate/resume',
  QUESTIONNAIRE: '/candidate/questionnaire',
  INTERVIEWS: '/candidate/interviews',
  INTERVIEW_DETAIL: (id) => `/candidate/interviews/${id}`,
});

export const HR = Object.freeze({
  CANDIDATES_BULK: '/hr/candidates/bulk',
  EMAIL_TRIGGERS: '/hr/emails/triggers',
  EMPLOYEES: '/hr/employees',
  ASSIGN_TO_EMPLOYEE: '/hr/assign-to-employee',
  REAPPEAR: '/hr/reappear',
  REAPPEAR_DETAIL: (id) => `/hr/reappear/${id}`,
  LIVE_WS: '/ws/hr/live',
});

export const CHAT = Object.freeze({
  THREADS: '/chat/threads',
  MESSAGES: (threadId) => `/chat/threads/${threadId}/messages`,
});

export default {
  AUTH,
  USERS,
  REPORTS,
  TESTS,
  QUESTIONS,
  CANDIDATE,
  HR,
  CHAT,
  withBase,
};
