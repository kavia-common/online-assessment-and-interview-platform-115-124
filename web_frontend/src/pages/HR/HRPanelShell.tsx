import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card: React.FC<{ title: string; to: string; desc: string; }> = ({ title, to, desc }) => {
  const navigate = useNavigate();
  return (
    <div role="button" tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(to)}
      className="card"
      style={{ padding: 16, cursor: 'pointer' }}
      aria-label={title}
    >
      <h3 className="h3" style={{ color: 'var(--color-primary)' }}>{title}</h3>
      <p className="muted">{desc}</p>
    </div>
  );
};

/**
 * HRPanelShell: cards for Test Setup, Bulk Upload, Monitoring, Emails, Results, Metrics.
 */
const HRPanelShell: React.FC = () => {
  const cards = [
    { title: 'Test Setup', to: '/hr/panel', desc: 'Configure patterns, timing, and rules.' },
    { title: 'Bulk Upload', to: '/hr/panel/bulk', desc: 'Upload candidate lists.' },
    { title: 'Monitoring', to: '/hr/panel/monitoring', desc: 'Real-time test monitoring.' },
    { title: 'Emails', to: '/hr/panel/emails', desc: 'Trigger invitations and reminders.' },
    { title: 'Results', to: '/hr/panel/results', desc: 'Filter, sort, and export results.' },
    { title: 'Metrics', to: '/hr/panel/metrics', desc: 'Dashboards and analytics.' },
  ];
  return (
    <div className="container">
      <h1 className="h1">HR Panel</h1>
      <p className="muted">Access HR controls and monitoring tools.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12, marginTop: 12 }}>
        {cards.map(c => <Card key={c.title} {...c} />)}
      </div>
    </div>
  );
};

export default HRPanelShell;
