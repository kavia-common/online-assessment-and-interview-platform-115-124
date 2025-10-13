import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function EmployeeLayout() {
  const nav = [
    { to: '/employee', label: 'Dashboard' },
    { to: '/employee/interviews', label: 'Interviews', disabled: true },
    { to: '/employee/chat', label: 'Chat', disabled: true },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar title="Employee" items={nav} />
      </aside>
      <header className="topbar">
        <Topbar title="Employee Portal" />
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
