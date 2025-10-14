import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import env from '../config/env';
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
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((t) => {
    if (t) {
      localStorage.setItem('auth_token', t);
    } else {
      localStorage.removeItem('auth_token');
    }
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
    if (res?.access_token) {
      persistToken(res.access_token);
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

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  }), [user, token, loading, login, register, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
