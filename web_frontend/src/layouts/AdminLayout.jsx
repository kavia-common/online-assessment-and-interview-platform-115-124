import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function AdminLayout() {
  const nav = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users', disabled: true },
    { to: '/admin/reports', label: 'Reports', disabled: true },
    { to: '/admin/settings', label: 'Settings', disabled: true },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar title="Admin" items={nav} />
      </aside>
      <header className="topbar">
        <Topbar title="Admin Console" />
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
