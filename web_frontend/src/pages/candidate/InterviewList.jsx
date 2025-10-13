import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import { Link } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';

/**
 * PUBLIC_INTERFACE
 * InterviewList - shows scheduled interviews for the candidate.
 */
export default function InterviewList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await candidateService.listInterviews();
        setItems(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    { key: 'role', title: 'Role', dataIndex: 'role' },
    { key: 'date', title: 'Date & Time', dataIndex: 'date' },
    { key: 'mode', title: 'Mode', dataIndex: 'mode' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Scheduled' ? 'primary' : v === 'Pending' ? 'warning' : 'success'}>{v}</Tag> },
    { key: 'action', title: 'Action', dataIndex: 'id', render: (v) => <Link to={`/candidate/interviews/${v}`}>View</Link> },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="My Interviews">
        {loading ? (
          <div className="p-16">Loading...</div>
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>
    </div>
  );
}
