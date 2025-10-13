import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesIndex from './routes';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App is the root component that attaches the Router and renders the route tree.
 */
function App() {
  return (
    <BrowserRouter>
      <RoutesIndex />
    </BrowserRouter>
  );
}

export default App;
