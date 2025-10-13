import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function AdminLayout() {
  const nav = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/questions', label: 'Question Bank' },
    { to: '/admin/tests/templates', label: 'Test Templates' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/maintenance', label: 'Maintenance' },
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
