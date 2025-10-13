import React from 'react';
import KPIGrid from '../../components/common/KPIGrid';
import TrendChart from '../../components/common/TrendChart';
import ActivityFeed from '../../components/common/ActivityFeed';
import Card from '../../components/common/Card';
import Tabs from '../../components/common/Tabs';
import { getDashboardMockData } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * HRDashboard
 * Dashboard for HR with KPIs, live tests trend, and events.
 */
export default function HRDashboard() {
  const data = getDashboardMockData('hr');

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div style={{ display: 'grid', gap: 16 }}>
          <KPIGrid items={data.kpis} columns={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Card title="Live Tests Trend">
              <TrendChart data={data.trend} />
            </Card>
            <Card title="Recent Events">
              <ActivityFeed items={data.activity} />
            </Card>
          </div>
        </div>
      ),
    },
    {
      key: 'assignments',
      label: 'Assignments',
      content: (
        <Card title="Assignments">
          <p style={{ color: '#4B5563' }}>Assign candidates to employees using the HR modules in the sidebar.</p>
        </Card>
      ),
    },
    {
      key: 'results',
      label: 'Results',
      content: (
        <Card title="Results & Exports">
          <p style={{ color: '#4B5563' }}>Filter, sort and export results from the Results module.</p>
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
        <h2 style={{ margin: 0, color: '#111827' }}>HR Dashboard</h2>
        <p style={{ margin: 0, marginTop: 4, color: '#4B5563' }}>
          Manage test setup, assignments, monitoring and results.
        </p>
      </div>
      <Tabs items={tabs} />
    </div>
  );
}
