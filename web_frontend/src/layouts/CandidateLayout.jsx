import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function CandidateLayout() {
  const nav = [
    { to: '/candidate', label: 'Dashboard' },
    { to: '/candidate/tests', label: 'My Tests', disabled: true },
    { to: '/candidate/profile', label: 'Profile', disabled: true },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar title="Candidate" items={nav} />
      </aside>
      <header className="topbar">
        <Topbar title="Candidate Portal" />
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
