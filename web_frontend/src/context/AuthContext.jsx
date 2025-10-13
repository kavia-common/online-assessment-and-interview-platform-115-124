import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken as apiSetToken } from '../services/apiClient';
import { roleHome } from '../utils/roleRoutes';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app and provides authentication state and helpers.
 * - Persists token and user in localStorage
 * - Hydrates on mount
 * - Exposes user, roles, token, isAuthenticated, login, logout
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(null);
  const nav = useNavigate();

  // Hydrate from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_state');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.token) {
        setToken(parsed.token);
        apiSetToken(parsed.token);
      }
      if (parsed?.user) {
        setUser(parsed.user);
      }
      if (Array.isArray(parsed?.roles)) {
        setRoles(parsed.roles);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist when changes
  useEffect(() => {
    try {
      const data = JSON.stringify({ user, roles, token });
      localStorage.setItem('auth_state', data);
    } catch {
      // ignore
    }
  }, [user, roles, token]);

  const isAuthenticated = !!token;

  // PUBLIC_INTERFACE
  const login = useCallback(async (credentials) => {
    /**
     * PUBLIC_INTERFACE
     * login accepts { email, password, role } and sets a fake token and user object.
     * No real API calls in this step.
     */
    const { email, role = 'candidate' } = credentials || {};
    // Generate a placeholder token
    const fakeToken = `fake.${btoa(email || 'user')}.${
      role
    }.token`;
    setToken(fakeToken);
    apiSetToken(fakeToken);

    const nextUser = {
      id: 'u_' + Math.random().toString(36).slice(2, 8),
      email,
      name: email?.split('@')[0] || 'User',
      role,
    };
    setUser(nextUser);
    setRoles([role]);

    // Redirect by role
    const home = roleHome[role] || '/';
    nav(home, { replace: true });

    return { ok: true, user: nextUser, token: fakeToken };
  }, [nav]);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /**
     * PUBLIC_INTERFACE
     * logout clears stored auth and navigates to login.
     */
    setUser(null);
    setRoles([]);
    setToken(null);
    apiSetToken(null);
    try {
      localStorage.removeItem('auth_state');
      localStorage.removeItem('auth_token');
    } catch {
      // ignore
    }
    nav('/auth/login', { replace: true });
  }, [nav]);

  const value = useMemo(
    () => ({
      user,
      roles,
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [user, roles, token, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
