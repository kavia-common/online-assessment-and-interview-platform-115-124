import { apiClient } from './apiClient';
import { QUESTIONS } from './endpoints';

/**
 * PUBLIC_INTERFACE
 * questionsService - question bank CRUD and import/export.
 */
export const questionsService = {
  // PUBLIC_INTERFACE
  async list(params = {}) {
    /** GET list of questions */
    const res = await apiClient.get(QUESTIONS.ROOT, { params });
    return res.data?.items || [];
  },

  // PUBLIC_INTERFACE
  async get(id) {
    /** GET question detail */
    const res = await apiClient.get(QUESTIONS.DETAIL(id));
    return res.data;
  },

  // PUBLIC_INTERFACE
  async create(payload) {
    /** POST create question */
    const res = await apiClient.post(QUESTIONS.ROOT, payload);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async update(id, payload) {
    /** PUT update question */
    const res = await apiClient.put(QUESTIONS.DETAIL(id), payload);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async remove(id) {
    /** DELETE question */
    const res = await apiClient.delete(QUESTIONS.DETAIL(id));
    return res.data;
  },

  // PUBLIC_INTERFACE
  async importFile(meta) {
    /** POST import - mocked via JSON meta */
    const res = await apiClient.post(QUESTIONS.IMPORT, meta);
    return res.data;
  },

  // PUBLIC_INTERFACE
  async exportAll() {
    /** GET/POST export placeholder */
    const res = await apiClient.post(QUESTIONS.EXPORT, {});
    return res.data;
  },
};
