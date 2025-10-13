import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CandidateLayout from '../layouts/CandidateLayout';
import AdminLayout from '../layouts/AdminLayout';
import HRLayout from '../layouts/HRLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AuthLayout from '../layouts/AuthLayout';
import PublicLayout from '../layouts/PublicLayout';

import CandidateDashboard from '../pages/dashboard/CandidateDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import HRDashboard from '../pages/dashboard/HRDashboard';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import PrivateRoute from '../components/routing/PrivateRoute';
import RoleRoute from '../components/routing/RoleRoute';

import TestLauncher from '../pages/candidate/TestLauncher';
import TestRunner from '../pages/candidate/TestRunner';
import TestSummary from '../pages/candidate/TestSummary';

/**
 * PUBLIC_INTERFACE
 * RoutesIndex defines the routing tree with role-based nested routes.
 */
export default function RoutesIndex() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/public" element={<div className="container"><h2>Welcome</h2><p>Public landing page placeholder.</p></div>} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* Candidate */}
        <Route element={<RoleRoute allow={['candidate']} />}>
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="tests/launch" element={<TestLauncher />} />
            <Route path="tests/run/:testId" element={<TestRunner />} />
            <Route path="tests/summary/:testId" element={<TestSummary />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleRoute allow={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* HR */}
        <Route element={<RoleRoute allow={['hr']} />}>
          <Route path="/hr" element={<HRLayout />}>
            <Route index element={<HRDashboard />} />
          </Route>
        </Route>

        {/* Employee */}
        <Route element={<RoleRoute allow={['employee']} />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
