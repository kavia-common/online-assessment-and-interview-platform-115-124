import React from 'react';
import Card from '../../components/common/Card';
import StatTile from '../../components/common/StatTile';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';

export default function HRDashboard() {
  const columns = [
    { key: 'name', title: 'Batch', dataIndex: 'name' },
    { key: 'candidates', title: 'Candidates', dataIndex: 'candidates' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'In Progress' ? 'primary' : 'success'}>{v}</Tag> },
  ];
  const data = [
    { name: 'Spring 2025', candidates: 120, status: 'In Progress' },
    { name: 'Fall 2024', candidates: 98, status: 'Completed' },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <StatTile label="Active Batches" value="3" trend={2} />
        <StatTile label="In Test" value="45" trend={1} />
        <StatTile label="Awaiting Interview" value="18" />
      </div>

      <Card title="Recent Batches">
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}
