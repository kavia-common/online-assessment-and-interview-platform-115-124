import React from 'react';

export type Role = 'candidate' | 'admin' | 'employee' | 'hr';

type AuthCtx = {
  role: Role;
  setRole: (r: Role) => void;
  userId: string;
};

// PUBLIC_INTERFACE
export const AuthContext = React.createContext<AuthCtx | null>(null);

/**
 * AuthProvider manages mock auth state with role persistence in localStorage.
 */
export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [role, setRoleState] = React.useState<Role>(() => {
    const fromLS = typeof window !== 'undefined' ? (localStorage.getItem('role') as Role | null) : null;
    return fromLS ?? 'candidate';
  });
  const setRole = (r: Role) => {
    setRoleState(r);
    try { localStorage.setItem('role', r); } catch {}
  };
  // Mock userId by role for demo
  const userId = React.useMemo(() => `${role}-user-001`, [role]);

  return <AuthContext.Provider value={{ role, setRole, userId }}>{children}</AuthContext.Provider>;
};

// PUBLIC_INTERFACE
export const useAuth = () => {
  /** Hook to access mock auth context with role and userId. */
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
