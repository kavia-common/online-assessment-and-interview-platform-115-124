import React from 'react';
import KPIGrid from '../../components/common/KPIGrid';
import TrendChart from '../../components/common/TrendChart';
import ActivityFeed from '../../components/common/ActivityFeed';
import Card from '../../components/common/Card';
import Tabs from '../../components/common/Tabs';
import { getDashboardMockData } from '../../services/mockData';
import '../../theme/global.css';

/**
 * PUBLIC_INTERFACE
 * CandidateDashboard
 * Dashboard for candidates with overview KPIs, trends and activity feed.
 */
export default function CandidateDashboard() {
  const data = getDashboardMockData('candidate');

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div style={{ display: 'grid', gap: 16 }}>
          <KPIGrid items={data.kpis} columns={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Card title="Performance Trend">
              <TrendChart data={data.trend} />
            </Card>
            <Card title="Recent Activity">
              <ActivityFeed items={data.activity} />
            </Card>
          </div>
        </div>
      ),
    },
    {
      key: 'tests',
      label: 'Tests',
      content: (
        <Card title="Your Tests">
          <p style={{ color: '#4B5563' }}>
            Quick access to upcoming and completed tests will appear here. Use the left navigation for detailed modules.
          </p>
        </Card>
      ),
    },
    {
      key: 'messages',
      label: 'Messages',
      content: (
        <Card title="Messages">
          <p style={{ color: '#4B5563' }}>Chat updates and notifications will be shown here.</p>
        </Card>
      ),
    },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          background: 'linear-gradient(to right, rgba(59,130,246,0.08), rgba(243,244,246,1))',
          border: '1px solid rgba(37,99,235,0.12)',
          padding: '16px 20px',
          borderRadius: 12,
        }}
      >
        <h2 style={{ margin: 0, color: '#111827' }}>Candidate Dashboard</h2>
        <p style={{ margin: 0, marginTop: 4, color: '#4B5563' }}>
          Welcome to your dashboard. Track your tests, performance, and activity.
        </p>
      </div>
      <Tabs
        items={tabs}
      />
    </div>
  );
}
