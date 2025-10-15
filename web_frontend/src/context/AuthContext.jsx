import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { endpoints } from '../services/endpoints';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async (_email, _password) => {},
  register: async (_form) => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /**
   * AuthProvider manages login, logout, token storage, and user profile.
   * It also listens for global logout events (triggered by 401 refresh failures).
   */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('auth_token') || localStorage.getItem('token'); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((t) => {
    try {
      if (t) {
        localStorage.setItem('auth_token', t);
        localStorage.setItem('token', t);
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
      }
    } catch {}
    setToken(t || null);
  }, []);

  const loadMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await apiClient.get(endpoints.auth.me());
      setUser(me);
    } catch {
      // invalid token
      persistToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, persistToken]);

  useEffect(() => {
    loadMe();
    const onLogout = () => {
      persistToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await apiClient.post(endpoints.auth.login(), { email, password });
    const accessToken = res?.access_token || res?.token;
    if (accessToken) {
      persistToken(accessToken);
      await loadMe();
    }
    return res;
  }, [persistToken, loadMe]);

  const register = useCallback(async (form) => {
    const res = await apiClient.post(endpoints.auth.register(), form);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(endpoints.auth.logout(), {});
    } catch {
      // ignore
    }
    persistToken(null);
    setUser(null);
  }, [persistToken]);

  const refreshProfile = useCallback(async () => {
    await loadMe();
  }, [loadMe]);

  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : undefined) || 'candidate';
  const value = useMemo(() => ({
    user,
    token,
    role,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    hasRole: (r) => r === role || (Array.isArray(user?.roles) && user.roles.includes(r)),
    isAuthenticated: !!user,
  }), [user, token, role, loading, login, register, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
