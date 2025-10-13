import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/navigation/Topbar';

export default function PublicLayout() {
  return (
    <div className="layout no-sidebar">
      <header className="topbar">
        <Topbar title="Welcome" />
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
