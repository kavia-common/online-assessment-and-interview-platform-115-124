import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import HRLayout from '../layouts/HRLayout';
import AdminLayout from '../layouts/AdminLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
// Use existing JSX dashboard files under src/pages/dashboard (lowercase dir)
import HRDashboard from '../pages/dashboard/HRDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import CandidateDashboard from '../pages/dashboard/CandidateDashboard';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';

const RoleGate = ({ allowed, children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /**
   * Main application routes with role-based protection and layout shells.
   */
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          path="/hr/*"
          element={
            <RoleGate allowed={['hr', 'admin']}>
              <HRLayout />
            </RoleGate>
          }
        >
          <Route index element={<HRDashboard />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <RoleGate allowed={['admin']}>
              <AdminLayout />
            </RoleGate>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route
          path="/candidate/*"
          element={
            <RoleGate allowed={['candidate']}>
              <CandidateLayout />
            </RoleGate>
          }
        >
          <Route index element={<CandidateDashboard />} />
        </Route>

        <Route
          path="/employee/*"
          element={
            <RoleGate allowed={['employee', 'admin', 'hr']}>
              <EmployeeLayout />
            </RoleGate>
          }
        >
          <Route index element={<EmployeeDashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
