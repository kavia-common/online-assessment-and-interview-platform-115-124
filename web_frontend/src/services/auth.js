import { apiClient } from './apiClient';
import { AUTH } from './endpoints';

/**
 * PUBLIC_INTERFACE
 * authService - wraps authentication-related calls.
 */
export const authService = {
  // PUBLIC_INTERFACE
  async login(credentials) {
    /** POST /auth/login */
    const res = await apiClient.post(AUTH.LOGIN, credentials);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async logout() {
    /** POST /auth/logout */
    const res = await apiClient.post(AUTH.LOGOUT, {});
    return res.data;
  },

  // PUBLIC_INTERFACE
  async register(payload) {
    /** POST /auth/register */
    const res = await apiClient.post(AUTH.REGISTER, payload);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async me() {
    /** GET /auth/me */
    const res = await apiClient.get(AUTH.PROFILE);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async refresh() {
    /** POST /auth/refresh */
    const res = await apiClient.post(AUTH.REFRESH, {});
    return res.data;
  },
};
