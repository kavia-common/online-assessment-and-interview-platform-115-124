import React from 'react';
import Card from '../../components/common/Card';
import TextField from '../../components/common/forms/TextField';
import SelectField from '../../components/common/forms/SelectField';
import Button from '../../components/common/Button';

/**
 * PUBLIC_INTERFACE
 * Filters - reusable/placeholder filter UI block for HR modules.
 */
export default function Filters({ value = {}, onChange, onApply }) {
  const setVal = (k, v) => onChange?.({ ...value, [k]: v });

  return (
    <Card title="Filters">
      <div className="card p-16" style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr 1fr auto' }}>
        <TextField label="Search" value={value.query || ''} onChange={(v) => setVal('query', v)} />
        <SelectField label="Status" value={value.status || 'all'} onChange={(v) => setVal('status', v)} options={[
          { value: 'all', label: 'All' },
          { value: 'Active', label: 'Active' },
          { value: 'Draft', label: 'Draft' },
        ]} />
        <TextField label="From" type="date" value={value.from || ''} onChange={(v) => setVal('from', v)} />
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <Button variant="secondary" onClick={() => onApply?.()}>Apply</Button>
        </div>
      </div>
    </Card>
  );
}
