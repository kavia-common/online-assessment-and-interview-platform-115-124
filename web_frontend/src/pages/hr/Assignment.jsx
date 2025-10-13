import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import TextField from '../../components/common/forms/TextField';
import SelectField from '../../components/common/forms/SelectField';
import Modal from '../../components/common/Modal';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * Assignment - manage candidate to test assignments.
 */
export default function Assignment() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ candidate: '', test: '', due: '' });

  const load = async () => {
    const list = await hrService.listAssignments();
    setItems(list);
  };

  useEffect(() => { load(); }, []);

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const startAssign = () => { setForm({ candidate: '', test: '', due: '' }); setOpen(true); };

  const onAssign = async () => {
    if (!form.candidate?.trim() || !form.test?.trim()) return alert('Candidate and Test are required');
    await hrService.assignCandidate(form);
    setOpen(false);
    load();
  };

  const columns = useMemo(() => [
    { key: 'candidate', title: 'Candidate', dataIndex: 'candidate' },
    { key: 'test', title: 'Test', dataIndex: 'test' },
    { key: 'due', title: 'Due', dataIndex: 'due' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ], []);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Assignments" extra={<Button onClick={startAssign}>Assign</Button>}>
        <Table columns={columns} data={items} />
      </Card>

      <Modal open={open} title="Assign Candidate" onClose={() => setOpen(false)}>
        <div style={{ display: 'grid', gap: 12 }}>
          <TextField label="Candidate Name" value={form.candidate} onChange={(v) => setVal('candidate', v)} required />
          <TextField label="Test Name" value={form.test} onChange={(v) => setVal('test', v)} required />
          <TextField label="Due Date" type="date" value={form.due} onChange={(v) => setVal('due', v)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onAssign}>Assign</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
