import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/theme.css';

// PUBLIC_INTERFACE
function bootstrap() {
  /** Bootstraps the React application with BrowserRouter and global theme. */
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container #root not found');
    return;
  }
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap();
