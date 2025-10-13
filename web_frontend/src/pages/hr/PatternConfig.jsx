import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextField from '../../components/common/forms/TextField';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * PatternConfig - define question pattern rules for tests.
 */
export default function PatternConfig() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', rules: '' });

  const load = async () => {
    const list = await hrService.getPatterns();
    setItems(list);
  };

  useEffect(() => { load(); }, []);

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const startCreate = () => { setEditing(null); setForm({ name: '', rules: '' }); setOpen(true); };
  const startEdit = (row) => { setEditing(row); setForm({ name: row.name, rules: row.rules }); setOpen(true); };

  const onSave = async () => {
    if (!form.name?.trim()) return alert('Name is required');
    await hrService.savePattern({ ...form, id: editing?.id });
    setOpen(false);
    load();
  };

  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'rules', title: 'Rules', dataIndex: 'rules' },
    {
      key: 'actions', title: 'Actions', dataIndex: 'id',
      render: (_, row) => <Button variant="secondary" onClick={() => startEdit(row)}>Edit</Button>
    },
  ];

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Pattern Configuration" extra={<Button onClick={startCreate}>New Pattern</Button>}>
        <Table columns={columns} data={items} />
      </Card>

      <Modal open={open} title={editing ? 'Edit Pattern' : 'New Pattern'} onClose={() => setOpen(false)}>
        <div style={{ display: 'grid', gap: 12 }}>
          <TextField label="Name" value={form.name} onChange={(v) => setVal('name', v)} required />
          <TextField label="Rules" value={form.rules} onChange={(v) => setVal('rules', v)} placeholder="e.g., MCQ 60%, Theory 40%" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
