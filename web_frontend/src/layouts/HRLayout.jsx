import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function HRLayout() {
  const nav = [
    { to: '/hr', label: 'Dashboard' },
    { to: '/hr/tests', label: 'Tests', disabled: true },
    { to: '/hr/candidates', label: 'Candidates', disabled: true },
    { to: '/hr/reports', label: 'Reports', disabled: true },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar title="HR" items={nav} />
      </aside>
      <header className="topbar">
        <Topbar title="HR Workspace" />
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
