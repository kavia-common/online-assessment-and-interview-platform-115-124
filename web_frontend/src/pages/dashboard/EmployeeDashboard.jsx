import React from 'react';
import KPIGrid from '../../components/common/KPIGrid';
import TrendChart from '../../components/common/TrendChart';
import ActivityFeed from '../../components/common/ActivityFeed';
import Card from '../../components/common/Card';
import Tabs from '../../components/common/Tabs';
import { getDashboardMockData } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * EmployeeDashboard
 * Dashboard for employees with throughput trend and activity.
 */
export default function EmployeeDashboard() {
  const data = getDashboardMockData('employee');

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div style={{ display: 'grid', gap: 16 }}>
          <KPIGrid items={data.kpis} columns={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Card title="Review Throughput">
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
      key: 'reviews',
      label: 'Reviews',
      content: (
        <Card title="Assigned Reviews">
          <p style={{ color: '#4B5563' }}>Your pending and completed reviews will appear here.</p>
        </Card>
      ),
    },
    {
      key: 'interviews',
      label: 'Interviews',
      content: (
        <Card title="Interviews">
          <p style={{ color: '#4B5563' }}>Interview schedules and feedback status overview.</p>
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
        <h2 style={{ margin: 0, color: '#111827' }}>Employee Dashboard</h2>
        <p style={{ margin: 0, marginTop: 4, color: '#4B5563' }}>
          Track your review workload, interviews and productivity trends.
        </p>
      </div>
      <Tabs items={tabs} />
    </div>
  );
}
