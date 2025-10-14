import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHRLiveMonitor } from '../../hooks/useHRLiveMonitor';

const NavCard: React.FC<{ title: string; to: string; desc: string; }> = ({ title, to, desc }) => {
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
 * HRPanelShell: cards and a live monitor feed below.
 */
const HRPanelShell: React.FC = () => {
  const { events } = useHRLiveMonitor();
  const cards = [
    { title: 'Test Setup', to: '/hr/panel', desc: 'Configure patterns, timing, and rules.' },
    { title: 'Bulk Upload', to: '/hr/panel/bulk', desc: 'Upload candidate lists.' },
    { title: 'Monitoring', to: '/hr/panel/monitoring', desc: 'Real-time test monitoring.' },
    { title: 'Emails', to: '/hr/panel/emails', desc: 'Trigger invitations and reminders.' },
    { title: 'Results', to: '/hr/panel/results', desc: 'Filter, sort, and export results.' },
    { title: 'Metrics', to: '/hr/panel/metrics', desc: 'Dashboards and analytics.' },
  ];
  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 className="h1">HR Panel</h1>
        <p className="muted">Access HR controls and monitoring tools.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12, marginTop: 12 }}>
          {cards.map(c => <NavCard key={c.title} {...c} />)}
        </div>
      </div>

      <div>
        <h2 className="header-gradient" style={{ padding: '12px 16px', borderRadius: 8 }}>
          Live Monitor
        </h2>
        <div style={{ marginTop: 12 }}>
          {events.length === 0 && <div>No live events yet.</div>}
          {events.map((e, idx) => (
            <div key={idx} className="card" style={{ padding: 12, marginBottom: 8 }}>
              <div><strong>Type:</strong> {e.type}</div>
              <div><strong>Time:</strong> {new Date(e.ts || Date.now()).toLocaleTimeString()}</div>
              {e.userId && <div><strong>User:</strong> {e.userId}</div>}
              {e.attemptId && <div><strong>Attempt:</strong> {e.attemptId}</div>}
              {e.sessionId && <div><strong>Session:</strong> {e.sessionId}</div>}
              {e.meta && <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(e.meta, null, 2)}</pre>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRPanelShell;
