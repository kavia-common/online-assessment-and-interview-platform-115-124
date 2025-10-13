import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/theme.css';

type NavItem = { label: string; to: string; };

const roleNavMap: Record<string, NavItem[]> = {
  candidate: [
    { label: 'Home', to: '/candidate' },
    { label: 'My Test', to: '/candidate/test' },
    { label: 'Profile', to: '/candidate/profile' },
    { label: 'Resume', to: '/candidate/resume' },
    { label: 'Interview Details', to: '/candidate/interviews' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Question Bank', to: '/admin/question-bank' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Reports', to: '/admin/reports' },
    { label: 'Backup/Restore', to: '/admin/maintenance' },
  ],
  employee: [
    { label: 'Dashboard', to: '/employee' },
    { label: 'Reviews', to: '/employee/reviews' },
    { label: 'Candidate Tests', to: '/employee/tests' },
    { label: 'Chat', to: '/employee/chat' },
  ],
  hr: [
    { label: 'Dashboard', to: '/hr' },
    { label: 'Test Setup', to: '/hr/panel' },
    { label: 'Bulk Upload', to: '/hr/panel/bulk' },
    { label: 'Monitoring', to: '/hr/panel/monitoring' },
    { label: 'Emails', to: '/hr/panel/emails' },
    { label: 'Results', to: '/hr/panel/results' },
    { label: 'Metrics', to: '/hr/panel/metrics' },
  ],
};

/**
 * Sidebar displays navigation items based on the current role.
 */
const Sidebar: React.FC<{ open?: boolean }> = ({ open = true }) => {
  const { role } = useAuth();
  const items = roleNavMap[role] ?? [];

  return (
    <aside className="sidebar sidebar-area" aria-label="Sidebar Navigation">
      <nav role="navigation" aria-label={`${role} navigation`} style={{ padding: 8, display: open ? 'block' : 'none' }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `item ${isActive ? 'active' : ''}`}
            end
          >
            <span aria-hidden>•</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
