import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import HRLayout from '../layouts/HRLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import HRDashboard from '../pages/dashboard/HRDashboard';
import CandidateDashboard from '../pages/dashboard/CandidateDashboard';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';
import PrivateRoute from '../components/routing/PrivateRoute';
import RoleRoute from '../components/routing/RoleRoute';

// Admin pages
import UsersList from '../pages/admin/users/UsersList';
import ReportsList from '../pages/admin/reports/ReportsList';
import { TemplateList, TemplateEditor } from '../pages/admin/tests';
import { QuestionBankList, QuestionEditor, ImportExport as QuestionsImportExport } from '../pages/admin/questions';
import Maintenance from '../pages/admin/maintenance/Maintenance';

// HR pages (use named exports from index)
import {
  AssignToEmployee,
  Assignment,
  BulkUpload,
  EmailTriggers,
  Export as HRExport,
  Filters,
  LiveMonitor,
  PatternConfig,
  ReappearRequests,
  ResultsList,
  TestConfig,
  TimeAdjustment,
} from '../pages/hr';

// Candidate pages
import CandidateProfile from '../pages/candidate/Profile';
import ResumeUpload from '../pages/candidate/ResumeUpload';
import Questionnaire from '../pages/candidate/Questionnaire';
import TestLauncher from '../pages/candidate/TestLauncher';
import TestRunner from '../pages/candidate/TestRunner';
import TestSummary from '../pages/candidate/TestSummary';
import InterviewList from '../pages/candidate/InterviewList';
import InterviewDetail from '../pages/candidate/InterviewDetail';

// Employee pages
import AssignedReviews from '../pages/employee/AssignedReviews';
import ReviewDetail from '../pages/employee/ReviewDetail';
import Interviews from '../pages/employee/Interviews';
import Chat from '../pages/employee/Chat';

/**
 * PUBLIC_INTERFACE
 * AppRoutes registers all app routes with role-based protection.
 */
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public auth routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Admin routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/reports" element={<ReportsList />} />
              <Route path="/admin/tests" element={<TemplateList />} />
              <Route path="/admin/tests/new" element={<TemplateEditor />} />
              <Route path="/admin/tests/:templateId" element={<TemplateEditor />} />
              <Route path="/admin/questions" element={<QuestionBankList />} />
              <Route path="/admin/questions/new" element={<QuestionEditor />} />
              <Route path="/admin/questions/:questionId" element={<QuestionEditor />} />
              <Route path="/admin/questions/import-export" element={<QuestionsImportExport />} />
              <Route path="/admin/maintenance" element={<Maintenance />} />
            </Route>
          </Route>

          {/* HR routes */}
          <Route element={<RoleRoute role="hr" />}>
            <Route element={<HRLayout />}>
              <Route path="/hr" element={<HRDashboard />} />
              <Route path="/hr/assign" element={<AssignToEmployee />} />
              <Route path="/hr/assignment" element={<Assignment />} />
              <Route path="/hr/bulk-upload" element={<BulkUpload />} />
              <Route path="/hr/email-triggers" element={<EmailTriggers />} />
              <Route path="/hr/export" element={<HRExport />} />
              <Route path="/hr/filters" element={<Filters />} />
              <Route path="/hr/live-monitor" element={<LiveMonitor />} />
              <Route path="/hr/pattern-config" element={<PatternConfig />} />
              <Route path="/hr/reappear-requests" element={<ReappearRequests />} />
              <Route path="/hr/results" element={<ResultsList />} />
              <Route path="/hr/test-config" element={<TestConfig />} />
              <Route path="/hr/time-adjustment" element={<TimeAdjustment />} />
            </Route>
          </Route>

          {/* Candidate routes */}
          <Route element={<RoleRoute role="candidate" />}>
            <Route element={<CandidateLayout />}>
              <Route path="/candidate" element={<CandidateDashboard />} />
              <Route path="/candidate/profile" element={<CandidateProfile />} />
              <Route path="/candidate/resume" element={<ResumeUpload />} />
              <Route path="/candidate/questionnaire" element={<Questionnaire />} />
              <Route path="/candidate/test-launcher" element={<TestLauncher />} />
              <Route path="/candidate/test/:testId" element={<TestRunner />} />
              <Route path="/candidate/test/:testId/summary" element={<TestSummary />} />
              <Route path="/candidate/interviews" element={<InterviewList />} />
              <Route path="/candidate/interviews/:interviewId" element={<InterviewDetail />} />
            </Route>
          </Route>

          {/* Employee routes */}
          <Route element={<RoleRoute role="employee" />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/reviews" element={<AssignedReviews />} />
              <Route path="/employee/reviews/:reviewId" element={<ReviewDetail />} />
              <Route path="/employee/interviews" element={<Interviews />} />
              <Route path="/employee/chat" element={<Chat />} />
            </Route>
          </Route>
        </Route>

        {/* default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
