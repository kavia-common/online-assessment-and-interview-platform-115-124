import React from 'react';
import Card from '../../components/common/Card';
import StatTile from '../../components/common/StatTile';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';

export default function EmployeeDashboard() {
  const columns = [
    { key: 'candidate', title: 'Candidate', dataIndex: 'candidate' },
    { key: 'test', title: 'Test', dataIndex: 'test' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Pending Review' ? 'warning' : 'success'}>{v}</Tag> },
  ];
  const data = [
    { candidate: 'Alex P.', test: 'JS Coding', status: 'Pending Review' },
    { candidate: 'Sam K.', test: 'Aptitude', status: 'Reviewed' },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        <StatTile label="Assigned" value="9" trend={3} />
        <StatTile label="Reviewed" value="6" trend={2} />
        <StatTile label="Pending" value="3" trend={-1} />
      </div>

      <Card title="Assignments">
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}
