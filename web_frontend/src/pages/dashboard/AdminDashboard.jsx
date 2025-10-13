import React from 'react';
import Card from '../../components/common/Card';
import StatTile from '../../components/common/StatTile';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';

export default function AdminDashboard() {
  const columns = [
    { key: 'name', title: 'Module', dataIndex: 'name' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Healthy' ? 'success' : 'warning'}>{v}</Tag> },
  ];
  const data = [
    { name: 'User Management', status: 'Healthy' },
    { name: 'Reports', status: 'Scheduled Maintenance' },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <StatTile label="Total Users" value="1,245" trend={4} />
        <StatTile label="Active Tests" value="12" trend={1} />
        <StatTile label="Pending Reviews" value="27" trend={-2} />
      </div>

      <Card title="System Overview">
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}
