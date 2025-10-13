import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import SelectField from '../../../components/common/forms/SelectField';
import TextField from '../../../components/common/forms/TextField';
import Tag from '../../../components/common/Tag';
import { adminService } from '../../../services/adminService';
import Loader from '../../../components/common/Loader';
import ErrorState from '../../../components/common/ErrorState';
import { useApi } from '../../../hooks/useApi';

/**
 * PUBLIC_INTERFACE
 * ReportsList - simple reports listing with date/status filters and export placeholder.
 */
export default function ReportsList() {
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', status: 'all' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, retry } = useApi(() => adminService.listReports(filters), [filters], { auto: false });

  const load = async () => {
    setLoading(true);
    try {
      const list = await adminService.listReports(filters);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dateFrom, filters.dateTo, filters.status]);

  const columns = useMemo(() => [
    { key: 'name', title: 'Report', dataIndex: 'name' },
    { key: 'type', title: 'Type', dataIndex: 'type' },
    { key: 'date', title: 'Date', dataIndex: 'date' },
    { key: 'status', title: 'Status', dataIndex: 'status', render: (v) => <Tag color={v === 'Ready' ? 'success' : 'warning'}>{v}</Tag> },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={async () => { await adminService.exportReport(id); alert('Export started (mock).'); }}>Export</Button>
          <Button variant="ghost" onClick={() => alert(`Open ${row.name} (placeholder)`)}>
            Open
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Reports">
        <div className="card p-16" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr auto' }}>
          <TextField label="From" name="from" type="date" value={filters.dateFrom} onChange={(v) => setFilters((f) => ({ ...f, dateFrom: v }))} />
          <TextField label="To" name="to" type="date" value={filters.dateTo} onChange={(v) => setFilters((f) => ({ ...f, dateTo: v }))} />
          <SelectField label="Status" name="status" value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} options={[
            { value: 'all', label: 'All' },
            { value: 'Ready', label: 'Ready' },
            { value: 'Processing', label: 'Processing' },
          ]} />
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <Button variant="secondary" onClick={load}>Refresh</Button>
          </div>
        </div>
        {loading && <Loader />}
        {!loading && <Table columns={columns} data={items} />}
        {!loading && items?.length === 0 && <div className="p-16">No reports found.</div>}
        {error && <div className="mt-8"><ErrorState error={error} onRetry={retry} /></div>}
      </Card>
    </div>
  );
}
