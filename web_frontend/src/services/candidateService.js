import { apiClient } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * Candidate service provides API methods for profile, resume, questionnaires, and interviews.
 * Uses mocked responses when REACT_APP_ENABLE_MOCKS is true via apiClient.
 */
export const candidateService = {
  // PUBLIC_INTERFACE
  async getProfile() {
    /** Fetch candidate profile */
    const res = await apiClient.get('/candidate/profile');
    return res.data?.profile || {
      name: 'Alex Candidate',
      email: 'alex@example.com',
      phone: '',
      location: '',
      experience: '0-1 years',
      summary: '',
    };
  },

  // PUBLIC_INTERFACE
  async updateProfile(profile) {
    /** Update candidate profile */
    const res = await apiClient.put('/candidate/profile', profile);
    return res.data || { success: true, profile };
  },

  // PUBLIC_INTERFACE
  async uploadResume(file) {
    /** Upload resume - mocked: returns file meta */
    // In a real app, this would be multipart/form-data; for mock, send metadata only
    const meta = { name: file.name, size: file.size, type: file.type };
    const res = await apiClient.post('/candidate/resume', meta);
    return res.data || { success: true, resumeId: 'res_' + Date.now(), meta };
  },

  // PUBLIC_INTERFACE
  async getQuestionnaire() {
    /** Get candidate questionnaire form schema and filled values */
    const res = await apiClient.get('/candidate/questionnaire');
    return (
      res.data?.questionnaire || {
        fields: [
          { key: 'highestEducation', label: 'Highest Education', type: 'select', options: ['High School', 'Bachelors', 'Masters', 'PhD'], required: true },
          { key: 'skills', label: 'Key Skills', type: 'text', required: true },
          { key: 'about', label: 'About You', type: 'textarea', required: false },
        ],
        values: {
          highestEducation: '',
          skills: '',
          about: '',
        },
      }
    );
  },

  // PUBLIC_INTERFACE
  async submitQuestionnaire(values) {
    /** Submit questionnaire answers */
    const res = await apiClient.post('/candidate/questionnaire', values);
    return res.data || { success: true, values };
  },

  // PUBLIC_INTERFACE
  async listInterviews() {
    /** List scheduled interviews */
    const res = await apiClient.get('/candidate/interviews');
    return (
      res.data?.items || [
        { id: 'iv1', role: 'Frontend Developer', date: '2025-11-10 10:00', mode: 'Online', status: 'Scheduled' },
        { id: 'iv2', role: 'Backend Developer', date: '2025-11-15 15:00', mode: 'In-person', status: 'Pending' },
      ]
    );
  },

  // PUBLIC_INTERFACE
  async getInterviewDetail(id) {
    /** Get interview details by id */
    const res = await apiClient.get(`/candidate/interviews/${id}`);
    return (
      res.data?.detail || {
        id,
        role: 'Frontend Developer',
        date: '2025-11-10 10:00',
        mode: 'Online',
        status: 'Scheduled',
        panel: [{ name: 'Sam HR' }, { name: 'Taylor Eng' }],
        notes: 'Be prepared to discuss projects and system design.',
        meetingLink: 'https://meet.example.com/room/abc123',
      }
    );
  },
};
