import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import TextField from '../../../components/common/forms/TextField';
import SelectField from '../../../components/common/forms/SelectField';
import Tabs from '../../../components/common/Tabs';

/**
 * PUBLIC_INTERFACE
 * TemplateEditor - Build/edit a test template with sections, weightages,
 * question counts, and time. Provides validation for total weightage = 100.
 */
export default function TemplateEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === 'new';

  const [meta, setMeta] = useState({
    name: isNew ? '' : 'Sample Template',
    durationMinutes: 60,
    totalMarks: 100,
    randomizeQuestions: true,
  });
  const [sections, setSections] = useState([
    { id: 's1', name: 'MCQ', weight: 60, count: 30, perQuestion: 2 },
    { id: 's2', name: 'Theory', weight: 40, count: 2, perQuestion: 20 },
  ]);

  const totalWeight = useMemo(() => sections.reduce((acc, s) => acc + Number(s.weight || 0), 0), [sections]);

  const setMetaVal = (k, v) => setMeta((m) => ({ ...m, [k]: v }));

  const addSection = () => {
    const id = 's_' + Math.random().toString(36).slice(2, 8);
    setSections((s) => [...s, { id, name: 'MCQ', weight: 0, count: 0, perQuestion: 1 }]);
  };
  const removeSection = (sid) => setSections((s) => s.filter((x) => x.id !== sid));
  const setSection = (sid, patch) =>
    setSections((s) => s.map((x) => (x.id === sid ? { ...x, ...patch } : x)));

  const onSave = () => {
    if (!meta.name?.trim()) return alert('Name is required');
    if (totalWeight !== 100) return alert('Total weightage must be 100%');
    alert('Template saved (mock)');
    if (isNew) nav('/admin/tests/templates');
  };

  const overview = (
    <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
        <TextField label="Name" name="name" value={meta.name} onChange={(v) => setMetaVal('name', v)} required />
        <TextField label="Duration (mins)" name="duration" type="number" value={meta.durationMinutes} onChange={(v) => setMetaVal('durationMinutes', Number(v))} />
        <TextField label="Total Marks" name="totalMarks" type="number" value={meta.totalMarks} onChange={(v) => setMetaVal('totalMarks', Number(v))} />
      </div>
      <div className="hr" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <strong>Sections</strong>
        <Button variant="secondary" onClick={addSection}>Add Section</Button>
        <div style={{ marginLeft: 'auto', color: totalWeight === 100 ? 'var(--color-success)' : 'var(--color-error)' }}>
          Total Weight: {totalWeight}%
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {sections.map((s) => (
          <div key={s.id} className="card p-16" style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12 }}>
              <TextField label="Section Name" value={s.name} onChange={(v) => setSection(s.id, { name: v })} />
              <SelectField
                label="Type"
                value={s.name}
                onChange={(v) => setSection(s.id, { name: v })}
                options={[
                  { value: 'MCQ', label: 'MCQ' },
                  { value: 'Theory', label: 'Theory' },
                ]}
              />
              <TextField label="Weight (%)" type="number" value={s.weight} onChange={(v) => setSection(s.id, { weight: Number(v) })} />
              <TextField label="Count" type="number" value={s.count} onChange={(v) => setSection(s.id, { count: Number(v) })} />
              <TextField label="Marks/Q" type="number" value={s.perQuestion} onChange={(v) => setSection(s.id, { perQuestion: Number(v) })} />
              <Button variant="ghost" onClick={() => removeSection(s.id)}>Remove</Button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Total for section: {s.count * s.perQuestion} marks
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const publishing = (
    <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
      <div style={{ color: 'var(--text-secondary)' }}>
        Define template-level behaviors and constraints. These are placeholders for future implementation:
      </div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Randomize question order: {String(meta.randomizeQuestions)}</li>
        <li>Per-section time caps</li>
        <li>Negative marking rules</li>
        <li>Allowed attempts and cooldown</li>
      </ul>
    </div>
  );

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card
        title={isNew ? 'Create Test Template' : `Edit Template - ${id}`}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={() => nav('/admin/tests/templates')}>Back</Button>
            <Button variant="secondary" onClick={onSave}>Save</Button>
            <Button onClick={() => alert('Publish (mock)')}>Publish</Button>
          </div>
        }
      >
        <Tabs
          items={[
            { key: 'overview', label: 'Overview', content: overview },
            { key: 'publishing', label: 'Publishing', content: publishing },
          ]}
        />
      </Card>
    </div>
  );
}
