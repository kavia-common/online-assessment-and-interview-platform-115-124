import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextField from '../../components/common/forms/TextField';
import Table from '../../components/common/Table';
import SelectField from '../../components/common/forms/SelectField';
import Modal from '../../components/common/Modal';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * TestConfig - HR page to create/update test configurations (name, duration, sections, status).
 */
export default function TestConfig() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', duration: 60, sections: 2, status: 'Draft' });

  const load = async () => {
    const list = await hrService.getTestConfigs();
    setItems(list);
  };

  useEffect(() => {
    load();
  }, []);

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const startCreate = () => { setEditing(null); setForm({ name: '', duration: 60, sections: 2, status: 'Draft' }); setOpen(true); };
  const startEdit = (row) => { setEditing(row); setForm({ name: row.name, duration: row.duration, sections: row.sections, status: row.status }); setOpen(true); };

  const onSave = async () => {
    if (!form.name?.trim()) return alert('Name is required');
    await hrService.saveTestConfig({ ...form, id: editing?.id });
    setOpen(false);
    load();
  };

  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'duration', title: 'Duration (mins)', dataIndex: 'duration' },
    { key: 'sections', title: 'Sections', dataIndex: 'sections' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => startEdit(row)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Test Configurations" extra={<Button onClick={startCreate}>New Config</Button>}>
        <Table columns={columns} data={items} />
      </Card>

      <Modal open={open} title={editing ? 'Edit Test Config' : 'New Test Config'} onClose={() => setOpen(false)}>
        <div style={{ display: 'grid', gap: 12 }}>
          <TextField label="Name" name="name" value={form.name} onChange={(v) => setVal('name', v)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField label="Duration (mins)" type="number" value={form.duration} onChange={(v) => setVal('duration', Number(v))} />
            <TextField label="Sections" type="number" value={form.sections} onChange={(v) => setVal('sections', Number(v))} />
          </div>
          <SelectField label="Status" name="status" value={form.status} onChange={(v) => setVal('status', v)} options={['Draft', 'Active']} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
