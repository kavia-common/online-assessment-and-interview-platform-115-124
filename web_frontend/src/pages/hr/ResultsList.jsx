import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import SelectField from '../../components/common/forms/SelectField';
import TextField from '../../components/common/forms/TextField';
import { hrService } from '../../services/hrService';
import Tag from '../../components/common/Tag';

/**
 * PUBLIC_INTERFACE
 * ResultsList - list results with basic filters and export action.
 */
export default function ResultsList() {
  const [filters, setFilters] = useState({ status: 'all', query: '' });
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    try {
      const list = await hrService.listResults(filters);
      setItems(list);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filters.status, filters.query]);

  const exportNow = async () => {
    const res = await hrService.exportResults(filters);
    alert('Export started (mock): ' + res.url);
  };

  const columns = useMemo(() => [
    { key: 'candidate', title: 'Candidate', dataIndex: 'candidate' },
    { key: 'test', title: 'Test', dataIndex: 'test' },
    { key: 'score', title: 'Score', dataIndex: 'score' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Passed' ? 'success' : 'error'}>{v}</Tag> },
    { key: 'date', title: 'Date', dataIndex: 'date' },
  ], []);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Results">
        <div className="card p-16" style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr auto' }}>
          <TextField label="Search" value={filters.query} onChange={(v) => setFilters((f) => ({ ...f, query: v }))} placeholder="Candidate or Test" />
          <SelectField label="Status" value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} options={[
            { value: 'all', label: 'All' },
            { value: 'Passed', label: 'Passed' },
            { value: 'Failed', label: 'Failed' },
          ]} />
          <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
            <Button variant="secondary" onClick={load} disabled={busy}>Refresh</Button>
            <Button onClick={exportNow}>Export</Button>
          </div>
        </div>
        {busy ? <div className="p-16">Loading...</div> : <Table columns={columns} data={items} />}
      </Card>
    </div>
  );
}
