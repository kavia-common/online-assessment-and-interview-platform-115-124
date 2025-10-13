import { apiClient } from './apiClient';
import { USERS } from './endpoints';

/**
 * PUBLIC_INTERFACE
 * usersService - admin user management APIs.
 */
export const usersService = {
  // PUBLIC_INTERFACE
  async list(params = {}) {
    /** GET /admin/users */
    const res = await apiClient.get(USERS.ROOT, { params });
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async create(payload) {
    /** POST /admin/users */
    const res = await apiClient.post(USERS.ROOT, payload);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async update(id, payload) {
    /** PUT /admin/users/:id */
    const res = await apiClient.put(USERS.DETAIL(id), payload);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async remove(id) {
    /** DELETE /admin/users/:id */
    const res = await apiClient.delete(USERS.DETAIL(id));
    return res.data;
  },
};
