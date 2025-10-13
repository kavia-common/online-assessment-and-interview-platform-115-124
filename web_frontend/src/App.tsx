import React from 'react';
import AppShell from './components/Layout/AppShell';
import AppRoutes from './router';
import { AuthProvider } from './hooks/useAuth';

/**
 * Root application component providing Auth context and AppShell wrapping routes.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </AuthProvider>
  );
};

export default App;
