import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CandidateDashboard from '../pages/Dashboard/CandidateDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import EmployeeDashboard from '../pages/Dashboard/EmployeeDashboard';
import HRDashboard from '../pages/Dashboard/HRDashboard';
import TakeTestShell from '../pages/Test/TakeTestShell';
import HRPanelShell from '../pages/HR/HRPanelShell';
import QuestionBankShell from '../pages/Admin/QuestionBankShell';
import RoleGuard from '../components/common/RoleGuard';
import { useAuth } from '../hooks/useAuth';

/**
 * AppRoutes defines role-based route groups and default redirect to current role dashboard.
 */
const AppRoutes: React.FC = () => {
  const { role } = useAuth();
  const roleHome = role === 'admin' ? '/admin' : role === 'employee' ? '/employee' : role === 'hr' ? '/hr' : '/candidate';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={roleHome} replace />} />

      {/* Candidate */}
      <Route path="/candidate" element={
        <RoleGuard allow={['candidate']}><CandidateDashboard /></RoleGuard>
      } />
      <Route path="/candidate/test" element={
        <RoleGuard allow={['candidate']}><TakeTestShell /></RoleGuard>
      } />
      <Route path="/candidate/profile" element={<RoleGuard allow={['candidate']}><div>Profile (placeholder)</div></RoleGuard>} />
      <Route path="/candidate/resume" element={<RoleGuard allow={['candidate']}><div>Resume Upload (placeholder)</div></RoleGuard>} />
      <Route path="/candidate/interviews" element={<RoleGuard allow={['candidate']}><div>Interview Details (placeholder)</div></RoleGuard>} />

      {/* Admin */}
      <Route path="/admin" element={
        <RoleGuard allow={['admin']}><AdminDashboard /></RoleGuard>
      } />
      <Route path="/admin/question-bank" element={<RoleGuard allow={['admin']}><QuestionBankShell /></RoleGuard>} />
      <Route path="/admin/users" element={<RoleGuard allow={['admin']}><div>Users (placeholder)</div></RoleGuard>} />
      <Route path="/admin/reports" element={<RoleGuard allow={['admin']}><div>Reports (placeholder)</div></RoleGuard>} />
      <Route path="/admin/maintenance" element={<RoleGuard allow={['admin']}><div>Backup/Restore (placeholder)</div></RoleGuard>} />

      {/* Employee */}
      <Route path="/employee" element={
        <RoleGuard allow={['employee']}><EmployeeDashboard /></RoleGuard>
      } />
      <Route path="/employee/reviews" element={<RoleGuard allow={['employee']}><div>Reviews (placeholder)</div></RoleGuard>} />
      <Route path="/employee/tests" element={<RoleGuard allow={['employee']}><div>Candidate Tests (placeholder)</div></RoleGuard>} />
      <Route path="/employee/chat" element={<RoleGuard allow={['employee']}><div>Chat (placeholder)</div></RoleGuard>} />

      {/* HR */}
      <Route path="/hr" element={
        <RoleGuard allow={['hr']}><HRDashboard /></RoleGuard>
      } />
      <Route path="/hr/panel" element={<RoleGuard allow={['hr']}><HRPanelShell /></RoleGuard>} />
      <Route path="/hr/panel/bulk" element={<RoleGuard allow={['hr']}><div>Bulk Upload (placeholder)</div></RoleGuard>} />
      <Route path="/hr/panel/monitoring" element={<RoleGuard allow={['hr']}><div>Monitoring (placeholder)</div></RoleGuard>} />
      <Route path="/hr/panel/emails" element={<RoleGuard allow={['hr']}><div>Emails (placeholder)</div></RoleGuard>} />
      <Route path="/hr/panel/results" element={<RoleGuard allow={['hr']}><div>Results (placeholder)</div></RoleGuard>} />
      <Route path="/hr/panel/metrics" element={<RoleGuard allow={['hr']}><div>Metrics (placeholder)</div></RoleGuard>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={roleHome} replace />} />
    </Routes>
  );
};

export default AppRoutes;
