import { apiClient } from './apiClient';
import { TESTS } from './endpoints';

/**
 * PUBLIC_INTERFACE
 * testsService - test templates and related operations.
 */
export const testsService = {
  // PUBLIC_INTERFACE
  async listTemplates() {
    /** GET list of templates */
    const res = await apiClient.get(TESTS.TEMPLATES);
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async getTemplate(id) {
    /** GET template detail */
    const res = await apiClient.get(TESTS.TEMPLATE_DETAIL(id));
    return res.data;
  },

  // PUBLIC_INTERFACE
  async saveTemplate(payload) {
    /** POST or PUT template based on id presence */
    if (payload?.id) {
      const res = await apiClient.put(TESTS.TEMPLATE_DETAIL(payload.id), payload);
      return res.data;
    }
    const res = await apiClient.post(TESTS.TEMPLATES, payload);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async deleteTemplate(id) {
    /** DELETE template */
    const res = await apiClient.delete(TESTS.TEMPLATE_DETAIL(id));
    return res.data;
  },
};
