import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/navigation/Topbar';

export default function AuthLayout() {
  return (
    <div className="layout no-sidebar">
      <header className="topbar">
        <Topbar title="Account" />
      </header>
      <main className="content">
        <div className="container card p-24" style={{ maxWidth: 480 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
