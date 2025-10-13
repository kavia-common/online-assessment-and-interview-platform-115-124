import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

export default function CandidateLayout() {
  const nav = [
    { to: '/candidate', label: 'Dashboard' },
    { to: '/candidate/profile', label: 'Profile' },
    { to: '/candidate/resume', label: 'Resume Upload' },
    { to: '/candidate/questionnaire', label: 'Questionnaire' },
    { to: '/candidate/interviews', label: 'Interviews' },
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
