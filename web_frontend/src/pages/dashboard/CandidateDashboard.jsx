import React from 'react';
import Card from '../../components/common/Card';
import StatTile from '../../components/common/StatTile';
import Tabs from '../../components/common/Tabs';
import Stepper from '../../components/common/Stepper';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';

export default function CandidateDashboard() {
  const columns = [
    { key: 'test', title: 'Test', dataIndex: 'test' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Scheduled' ? 'warning' : v === 'Completed' ? 'success' : 'primary'}>{v}</Tag> },
    { key: 'date', title: 'Date', dataIndex: 'date' },
  ];
  const data = [
    { test: 'Aptitude', status: 'Scheduled', date: '2025-11-04' },
    { test: 'Coding - JS', status: 'Completed', date: '2025-10-15' },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <StatTile label="Upcoming Tests" value="1" trend={5} />
        <StatTile label="Completed" value="4" trend={-3} />
        <StatTile label="Average Score" value="78%" />
      </div>

      <Card title="My Journey" extra={<Stepper steps={['Profile', 'Resume', 'Tests', 'Interview']} current={2} />}>
        <div />
      </Card>

      <Card title="My Tests">
        <Tabs
          items={[
            { key: 'scheduled', label: 'Scheduled', content: <Table columns={columns} data={data.slice(0,1)} /> },
            { key: 'history', label: 'History', content: <Table columns={columns} data={data} /> },
          ]}
        />
      </Card>
    </div>
  );
}
