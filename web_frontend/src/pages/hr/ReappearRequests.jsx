import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * ReappearRequests - approve/reject test reappear requests.
 */
export default function ReappearRequests() {
  const [items, setItems] = useState([]);
  const load = async () => setItems(await hrService.listReappearRequests());
  useEffect(() => { load(); }, []);

  const act = async (row, action) => {
    const res = await hrService.processReappear(row.id, action);
    alert(`Request ${res.status}`);
    load();
  };

  const columns = useMemo(() => [
    { key: 'candidate', title: 'Candidate', dataIndex: 'candidate' },
    { key: 'test', title: 'Test', dataIndex: 'test' },
    { key: 'reason', title: 'Reason', dataIndex: 'reason' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Pending' ? 'warning' : 'success'}>{v}</Tag> },
    {
      key: 'actions', title: 'Actions', dataIndex: 'id',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => act(row, 'approve')}>Approve</Button>
          <Button variant="ghost" onClick={() => act(row, 'reject')}>Reject</Button>
        </div>
      )
    },
  ], []);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Reappear Requests">
        <Table columns={columns} data={items} />
      </Card>
    </div>
  );
}
