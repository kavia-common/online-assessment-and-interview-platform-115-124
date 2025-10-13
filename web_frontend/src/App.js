import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesIndex from './routes';
import './App.css';
import { AuthProvider } from './context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * App is the root component that attaches the Router and renders the route tree.
 * Wraps the route tree with AuthProvider to expose authentication state.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesIndex />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
