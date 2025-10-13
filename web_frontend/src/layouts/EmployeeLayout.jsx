import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

/**
 * PUBLIC_INTERFACE
 * EmployeeLayout wraps employee-facing routes with sidebar and topbar.
 */
export default function EmployeeLayout() {
  const links = [
    { to: '/employee', label: 'Dashboard', icon: '📊' },
    { to: '/employee/reviews', label: 'Assigned Reviews', icon: '📝' },
    { to: '/employee/interviews', label: 'Interviews', icon: '🗓️' },
    { to: '/employee/chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar links={links} />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
