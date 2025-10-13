import React, { useMemo, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import TextField from '../../../components/common/forms/TextField';
import SelectField from '../../../components/common/forms/SelectField';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * QuestionBankList displays a list of questions with simple create/edit/delete placeholders.
 * Uses in-memory state with mock data. In a future step, connect to backend APIs.
 */
export default function QuestionBankList() {
  const nav = useNavigate();
  const [items, setItems] = useState([
    { id: 'q1', type: 'mcq', title: 'What is React?', difficulty: 'Easy', tags: ['react', 'frontend'] },
    { id: 'q2', type: 'theory', title: 'Explain event loop', difficulty: 'Medium', tags: ['js'] },
  ]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'mcq', difficulty: 'Easy', tags: '' });

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setEditing(null);
    setForm({ title: '', type: 'mcq', difficulty: 'Easy', tags: '' });
  };

  const onCreate = () => {
    reset();
    setOpen(true);
  };

  const onEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title,
      type: row.type,
      difficulty: row.difficulty,
      tags: (row.tags || []).join(','),
    });
    setOpen(true);
  };

  const onDelete = (row) => {
    if (window.confirm(`Delete question "${row.title}"?`)) {
      setItems((it) => it.filter((q) => q.id !== row.id));
    }
  };

  const onSave = () => {
    if (!form.title?.trim()) return alert('Title is required');
    if (editing) {
      setItems((it) =>
        it.map((q) =>
          q.id === editing.id
            ? {
                ...q,
                title: form.title.trim(),
                type: form.type,
                difficulty: form.difficulty,
                tags: form.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean),
              }
            : q
        )
      );
    } else {
      const id = 'q_' + Math.random().toString(36).slice(2, 8);
      setItems((it) => [
        ...it,
        {
          id,
          title: form.title.trim(),
          type: form.type,
          difficulty: form.difficulty,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        },
      ]);
    }
    setOpen(false);
    reset();
  };

  const columns = useMemo(
    () => [
      { key: 'title', title: 'Title', dataIndex: 'title' },
      { key: 'type', title: 'Type', dataIndex: 'type' },
      { key: 'difficulty', title: 'Difficulty', dataIndex: 'difficulty' },
      { key: 'tags', title: 'Tags', dataIndex: 'tags', render: (v) => (v || []).join(', ') },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
        render: (_, row) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => nav(`/admin/questions/edit/${row.id}`)}>Edit</Button>
            <Button variant="ghost" onClick={() => onEdit(row)}>Quick Edit</Button>
            <Button variant="ghost" onClick={() => onDelete(row)}>Delete</Button>
          </div>
        ),
      },
    ],
    [nav]
  );

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Question Bank"
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/admin/questions/import-export" className="btn" style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--bg-surface)' }}>
              Import/Export
            </Link>
            <Button onClick={onCreate}>New Question</Button>
          </div>
        }
      >
        <Table columns={columns} data={items} />
        <div className="mt-16" style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => nav('/admin/tests/templates')}>Manage Test Templates</Button>
        </div>
      </Card>

      <Modal open={open} title={editing ? 'Edit Question (Quick)' : 'Create Question (Quick)'} onClose={() => setOpen(false)}>
        <div style={{ display: 'grid', gap: 12 }}>
          <TextField label="Title" name="title" value={form.title} onChange={(v) => setVal('title', v)} required />
          <SelectField
            label="Type"
            name="type"
            value={form.type}
            onChange={(v) => setVal('type', v)}
            options={[
              { value: 'mcq', label: 'MCQ' },
              { value: 'theory', label: 'Theory' },
            ]}
          />
          <SelectField
            label="Difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={(v) => setVal('difficulty', v)}
            options={['Easy', 'Medium', 'Hard']}
          />
          <TextField label="Tags (comma separated)" name="tags" value={form.tags} onChange={(v) => setVal('tags', v)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
