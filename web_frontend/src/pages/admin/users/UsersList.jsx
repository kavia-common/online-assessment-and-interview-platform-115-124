import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import TextField from '../../../components/common/forms/TextField';
import SelectField from '../../../components/common/forms/SelectField';
import Tag from '../../../components/common/Tag';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { adminService } from '../../../services/adminService';

/**
 * PUBLIC_INTERFACE
 * UsersList - Admin users CRUD with role assignment and basic filters.
 * Uses mock adminService; replace with real API later.
 */
export default function UsersList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ search: '', role: 'all', status: 'all' });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', roles: ['candidate'], status: 'Active' });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await adminService.listUsers(filters);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.role, filters.status]);

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', roles: ['candidate'], status: 'Active' });
    setOpen(true);
  };

  const startEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name, email: row.email, roles: row.roles || [], status: row.status || 'Active' });
    setOpen(true);
  };

  const doDelete = (row) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (toDelete) {
      await adminService.deleteUser(toDelete.id);
      setItems((it) => it.filter((u) => u.id !== toDelete.id));
    }
    setConfirmOpen(false);
    setToDelete(null);
  };

  const onSave = async () => {
    if (!form.name?.trim()) return alert('Name is required');
    if (!form.email?.trim()) return alert('Email is required');
    if (!Array.isArray(form.roles) || form.roles.length === 0) return alert('Select at least one role');

    if (editing) {
      const updated = await adminService.updateUser(editing.id, { ...editing, ...form });
      setItems((it) => it.map((u) => (u.id === editing.id ? updated : u)));
    } else {
      const created = await adminService.createUser(form);
      setItems((it) => [created, ...it]);
    }
    setOpen(false);
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR' },
    { value: 'employee', label: 'Employee' },
    { value: 'candidate', label: 'Candidate' },
  ];

  const columns = useMemo(
    () => [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      { key: 'email', title: 'Email', dataIndex: 'email' },
      {
        key: 'roles',
        title: 'Roles',
        dataIndex: 'roles',
        render: (v) => (v || []).map((r) => <Tag key={r} color="primary" />) && (v || []).join(', '),
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        render: (v) => <Tag color={v === 'Active' ? 'success' : 'warning'}>{v}</Tag>,
      },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
        render: (_, row) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => startEdit(row)}>Edit</Button>
            <Button variant="ghost" onClick={() => doDelete(row)}>Delete</Button>
          </div>
        ),
      },
    ],
    []
  );

  const RoleCheckboxes = ({ value = [], onChange }) => {
    const toggle = (r) => {
      const has = value.includes(r);
      const next = has ? value.filter((x) => x !== r) : [...value, r];
      onChange(next);
    };
    return (
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        {roleOptions.map((opt) => (
          <label key={opt.value} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={value.includes(opt.value)} onChange={() => toggle(opt.value)} />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Users"
        extra={<Button onClick={startCreate}>New User</Button>}
      >
        <div className="card p-16" style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr 1fr' }}>
          <TextField label="Search" name="search" value={filters.search} onChange={(v) => setFilters((f) => ({ ...f, search: v }))} placeholder="Name or email" />
          <SelectField label="Role" name="role" value={filters.role} onChange={(v) => setFilters((f) => ({ ...f, role: v }))} options={[
            { value: 'all', label: 'All' },
            ...roleOptions
          ]} />
          <SelectField label="Status" name="status" value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} options={[
            { value: 'all', label: 'All' },
            { value: 'Active', label: 'Active' },
            { value: 'Suspended', label: 'Suspended' },
          ]} />
        </div>
        {loading ? <div className="p-16">Loading...</div> : <Table columns={columns} data={items} />}
      </Card>

      <Modal open={open} title={editing ? 'Edit User' : 'Create User'} onClose={() => setOpen(false)}>
        <div style={{ display: 'grid', gap: 12 }}>
          <TextField label="Full Name" name="name" value={form.name} onChange={(v) => setVal('name', v)} required />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={(v) => setVal('email', v)} required />
          <SelectField label="Status" name="status" value={form.status} onChange={(v) => setVal('status', v)} options={['Active', 'Suspended']} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Roles</div>
            <RoleCheckboxes value={form.roles} onChange={(v) => setVal('roles', v)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${toDelete?.name}"?`}
        confirmText="Delete"
        onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
