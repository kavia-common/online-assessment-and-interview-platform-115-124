import { apiClient } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * adminService - mock service for users, reports, and maintenance actions.
 * Uses apiClient mocks; replace paths with real endpoints later.
 */
export const adminService = {
  // PUBLIC_INTERFACE
  async listUsers(query = {}) {
    /** Return list of users with basic fields and roles */
    await apiClient.get('/admin/users'); // just to simulate latency
    const all = [
      { id: 'u1', name: 'Alice Admin', email: 'alice@corp.com', roles: ['admin'], status: 'Active' },
      { id: 'u2', name: 'Henry HR', email: 'henry@corp.com', roles: ['hr'], status: 'Active' },
      { id: 'u3', name: 'Evan Employee', email: 'evan@corp.com', roles: ['employee'], status: 'Suspended' },
      { id: 'u4', name: 'Cathy Candidate', email: 'cathy@user.com', roles: ['candidate'], status: 'Active' },
    ];
    const { search = '', role = 'all', status = 'all' } = query;
    const s = String(search).toLowerCase();
    return all.filter(u => {
      const matchText = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      const matchRole = role === 'all' || u.roles.includes(role);
      const matchStatus = status === 'all' || u.status === status;
      return matchText && matchRole && matchStatus;
    });
  },

  // PUBLIC_INTERFACE
  async createUser(payload) {
    /** Create user mock; returns created with random id */
    await apiClient.post('/admin/users', payload);
    return { ...payload, id: 'u_' + Math.random().toString(36).slice(2, 8) };
  },

  // PUBLIC_INTERFACE
  async updateUser(id, payload) {
    /** Update user mock */
    await apiClient.put(`/admin/users/${id}`, payload);
    return { id, ...payload };
  },

  // PUBLIC_INTERFACE
  async deleteUser(id) {
    /** Delete user mock */
    await apiClient.delete(`/admin/users/${id}`);
    return { success: true };
  },

  // PUBLIC_INTERFACE
  async listReports(filters = {}) {
    /** Return list of report summaries with status */
    await apiClient.get('/admin/reports');
    const base = [
      { id: 'r1', name: 'Daily Activity', date: '2025-10-01', status: 'Ready', type: 'Activity' },
      { id: 'r2', name: 'Test Results - Sept', date: '2025-09-30', status: 'Ready', type: 'Results' },
      { id: 'r3', name: 'Anomalies', date: '2025-09-29', status: 'Processing', type: 'Security' },
    ];
    const { dateFrom, dateTo, status = 'all' } = filters || {};
    return base.filter(r => {
      const okStatus = status === 'all' || r.status === status;
      const ts = new Date(r.date).getTime();
      const after = dateFrom ? ts >= new Date(dateFrom).getTime() : true;
      const before = dateTo ? ts <= new Date(dateTo).getTime() : true;
      return okStatus && after && before;
    });
  },

  // PUBLIC_INTERFACE
  async exportReport(id) {
    /** Placeholder export action; returns a blob URL string in real impl */
    await apiClient.get(`/admin/reports/${id}/export`);
    return { success: true };
  },

  // PUBLIC_INTERFACE
  async backupNow() {
    /** Trigger backup mock */
    await apiClient.post('/admin/maintenance/backup', {});
    return { success: true, jobId: 'b_' + Date.now() };
  },

  // PUBLIC_INTERFACE
  async restoreNow(fileMeta) {
    /** Trigger restore mock */
    await apiClient.post('/admin/maintenance/restore', fileMeta || {});
    return { success: true, jobId: 'r_' + Date.now() };
  },
};
