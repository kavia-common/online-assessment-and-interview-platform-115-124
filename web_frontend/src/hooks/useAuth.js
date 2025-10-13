import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function useAuth() {
  /** Convenience hook to access AuthContext */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
