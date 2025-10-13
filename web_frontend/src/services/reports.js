import { apiClient } from './apiClient';
import { REPORTS } from './endpoints';

/**
 * PUBLIC_INTERFACE
 * reportsService - admin reports related APIs.
 */
export const reportsService = {
  // PUBLIC_INTERFACE
  async list(params = {}) {
    /** GET /admin/reports */
    const res = await apiClient.get(REPORTS.ROOT, { params });
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async exportOne(id) {
    /** GET/POST export placeholder */
    const res = await apiClient.get(REPORTS.EXPORT(id));
    return res.data;
  },
};
