import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import HRLayout from '../layouts/HRLayout';
import AdminLayout from '../layouts/AdminLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import HRPanelShell from '../pages/HR/HRPanelShell.tsx';
import TakeTestShell from '../pages/Test/TakeTestShell.tsx';

// Existing dashboard pages live in lowercase directory per repository
import HRDashboard from '../pages/dashboard/HRDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import CandidateDashboard from '../pages/dashboard/CandidateDashboard';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, role }) => {
  const { hasRole, loading, isAuthenticated } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(role)) return <Navigate to="/" replace />;
  return children;
};

// PUBLIC_INTERFACE
export default function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route
            path="/candidate/*"
            element={
              <PrivateRoute>
                <RoleRoute role="candidate">
                  <CandidateLayout />
                </RoleRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<CandidateDashboard />} />
            <Route path="test" element={<TakeTestShell />} />
          </Route>

          <Route
            path="/hr/*"
            element={
              <PrivateRoute>
                <RoleRoute role="hr">
                  <HRLayout />
                </RoleRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<HRDashboard />} />
            <Route path="panel" element={<HRPanelShell />} />
          </Route>

          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <RoleRoute role="admin">
                  <AdminLayout />
                </RoleRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route
            path="/employee/*"
            element={
              <PrivateRoute>
                <RoleRoute role="employee">
                  <EmployeeLayout />
                </RoleRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<EmployeeDashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
