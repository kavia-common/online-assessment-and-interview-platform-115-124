import React from 'react';
import KPIGrid from '../../components/common/KPIGrid';
import TrendChart from '../../components/common/TrendChart';
import ActivityFeed from '../../components/common/ActivityFeed';
import Card from '../../components/common/Card';
import Tabs from '../../components/common/Tabs';
import { getDashboardMockData } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard
 * Dashboard for administrators with KPIs, trends, and system activity.
 */
export default function AdminDashboard() {
  const data = getDashboardMockData('admin');

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div style={{ display: 'grid', gap: 16 }}>
          <KPIGrid items={data.kpis} columns={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Card title="Daily Activity">
              <TrendChart data={data.trend} />
            </Card>
            <Card title="System Activity">
              <ActivityFeed items={data.activity} />
            </Card>
          </div>
        </div>
      ),
    },
    {
      key: 'users',
      label: 'Users',
      content: (
        <Card title="User Management">
          <p style={{ color: '#4B5563' }}>Manage users from the Users module in the sidebar.</p>
        </Card>
      ),
    },
    {
      key: 'reports',
      label: 'Reports',
      content: (
        <Card title="Reports Summary">
          <p style={{ color: '#4B5563' }}>Recent reports and exports will show here.</p>
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
        <h2 style={{ margin: 0, color: '#111827' }}>Admin Dashboard</h2>
        <p style={{ margin: 0, marginTop: 4, color: '#4B5563' }}>
          Administrative snapshot of activity, system health, and KPIs.
        </p>
      </div>
      <Tabs items={tabs} />
    </div>
  );
}
