import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function HRLayout() {
  const nav = [
    { to: '/hr', label: 'Dashboard' },
    { to: '/hr/test-config', label: 'Test Config' },
    { to: '/hr/pattern-config', label: 'Pattern Config' },
    { to: '/hr/bulk-upload', label: 'Bulk Upload' },
    { to: '/hr/assignment', label: 'Assignment' },
    { to: '/hr/email-triggers', label: 'Email Triggers' },
    { to: '/hr/live-monitor', label: 'Live Monitor' },
    { to: '/hr/time-adjustment', label: 'Time Adjustment' },
    { to: '/hr/reappear-requests', label: 'Reappear Requests' },
    { to: '/hr/results', label: 'Results' },
    { to: '/hr/export', label: 'Export' },
    { to: '/hr/assign-to-employee', label: 'Assign to Employee' },
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
