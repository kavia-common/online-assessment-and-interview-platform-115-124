import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHRLiveMonitor from '../../hooks/useHRLiveMonitor.ts';
import { apiClient } from '../../services/apiClient';
import { endpoints } from '../../services/endpoints';

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
 * HRPanelShell: cards and a live monitor feed below with result actions.
 */
const HRPanelShell: React.FC = () => {
  const { events } = useHRLiveMonitor();
  const [filters, setFilters] = React.useState({ status: 'all', q: '' });
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.q) params.set('q', filters.q);
      const url = `${endpoints.hr.results()}${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await apiClient.get(url);
      setResults(res?.items || res || []);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  const exportResults = async () => {
    await apiClient.post(endpoints.hr.export(), { filters });
    alert('Export triggered');
  };

  const adjustTime = async (attemptId: string, minutes: number) => {
    await apiClient.post(endpoints.hr.adjustTime(attemptId), { minutes });
    fetchResults();
  };

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

      <div className="card" style={{ padding: 16 }}>
        <h2 className="h2">Live Monitor</h2>
        <div style={{ marginTop: 12 }}>
          {events.length === 0 && <div>No live events yet.</div>}
          {events.slice(0, 100).map((e, idx) => (
            <div key={idx} style={{ padding: 8, borderBottom: '1px solid var(--border)' }}>
              <div><strong>{e.type}</strong> <span className="muted">· {new Date(e.ts || Date.now()).toLocaleTimeString()}</span></div>
              {e.sessionId && <div className="muted">Session: {e.sessionId}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="h2">Results</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Search..."
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              className="input"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              className="select"
            >
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
            </select>
            <button onClick={exportResults} className="btn btn-primary">Export</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="results-table w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th>Candidate</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Time Left</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(results || []).map((r) => (
                  <tr key={r.id || r.attemptId}>
                    <td>{r.candidateName || r.candidate?.name}</td>
                    <td>{r.status}</td>
                    <td>{r.score ?? '-'}</td>
                    <td>{r.timeLeft ?? '-'}</td>
                    <td>
                      <button onClick={() => adjustTime(r.attemptId || r.id, 5)} className="btn btn-outline btn-xs">+5m</button>
                    </td>
                  </tr>
                ))}
                {!results?.length && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 muted">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRPanelShell;
