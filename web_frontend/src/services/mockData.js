import { getSystemInfo } from '../utils/systemInfo';

/**
 * PUBLIC_INTERFACE
 * getDashboardMockData
 * Returns mock datasets for dashboards for different roles.
 */
export function getDashboardMockData(role = 'candidate') {
  const baseKpis = [
    { label: 'Tests Completed', value: 12, delta: 5 },
    { label: 'Avg. Score', value: '78%', delta: 2 },
    { label: 'Pending Actions', value: 3, delta: -1 },
    { label: 'Messages', value: 7, delta: 12 },
  ];

  const roleKpis = {
    candidate: baseKpis,
    admin: [
      { label: 'Total Users', value: 1423, delta: 3 },
      { label: 'Tests Today', value: 58, delta: 9 },
      { label: 'Issues', value: 2, delta: -50 },
      { label: 'Backups', value: 'OK', delta: 0 },
    ],
    hr: [
      { label: 'Assigned', value: 230, delta: 4 },
      { label: 'Live Tests', value: 26, delta: 8 },
      { label: 'Reappears', value: 5, delta: 1 },
      { label: 'Emails Sent', value: 320, delta: 15 },
    ],
    employee: [
      { label: 'Reviews Pending', value: 6, delta: -14 },
      { label: 'Interviews', value: 3, delta: 0 },
      { label: 'Avg. SLA', value: '12h', delta: -8 },
      { label: 'Quality', value: 'A', delta: 2 },
    ],
  };

  const trend = Array.from({ length: 16 }).map((_, i) => Math.round(60 + 20 * Math.sin(i / 2) + Math.random() * 10));

  const now = Date.now();
  const sampleActivity = [
    { type: 'info', title: 'System Sync', description: 'Nightly job finished successfully', timestamp: now - 1000 * 60 * 55 },
    { type: 'success', title: 'Test Submitted', description: 'Candidate submitted the MCQ round', timestamp: now - 1000 * 60 * 90 },
    { type: 'warning', title: 'Tab Switch Detected', description: 'Candidate switched tabs during test', timestamp: now - 1000 * 60 * 120 },
    { type: 'error', title: 'Camera Permission Denied', description: 'User rejected camera access', timestamp: now - 1000 * 60 * 150 },
    { type: 'info', title: 'New Registration', description: 'New candidate created an account', timestamp: now - 1000 * 60 * 210 },
  ];

  return {
    kpis: roleKpis[role] || baseKpis,
    trend,
    activity: sampleActivity,
    system: getSystemInfo ? getSystemInfo() : {},
  };
}
