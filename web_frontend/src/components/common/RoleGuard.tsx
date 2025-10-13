import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  allow: Array<'candidate' | 'admin' | 'employee' | 'hr'>;
  children: React.ReactNode;
};

/**
 * RoleGuard restricts access to routes based on current role.
 */
const RoleGuard: React.FC<Props> = ({ allow, children }) => {
  const { role } = useAuth();
  const location = useLocation();
  if (!allow.includes(role)) {
    // Redirect to role home
    const fallback = role === 'admin' ? '/admin' : role === 'employee' ? '/employee' : role === 'hr' ? '/hr' : '/candidate';
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default RoleGuard;
