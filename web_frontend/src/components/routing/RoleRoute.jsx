import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * RoleRoute checks required roles. If user lacks role, redirect to their home.
 */
export default function RoleRoute({ allow = [] }) {
  const { roles } = useAuth();

  if (!Array.isArray(allow) || allow.length === 0) {
    return <Outlet />;
  }

  const allowed = roles.some((r) => allow.includes(r));
  if (!allowed) {
    // Fallback to login; in a more advanced setup, redirect to role home.
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
