import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import SelectField from '../../../components/common/forms/SelectField';
import TextField from '../../../components/common/forms/TextField';
import Tabs from '../../../components/common/Tabs';
import MCQEditor from '../../../components/questions/MCQEditor';
import TheoryEditor from '../../../components/questions/TheoryEditor';

/**
 * PUBLIC_INTERFACE
 * QuestionEditor - Full editor for a single question with type-specific editors
 * and a preview tab. Uses local state and mocks save/publish actions.
 */
export default function QuestionEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = id === 'new';
  const [meta, setMeta] = useState({
    title: isNew ? '' : 'Sample Question',
    type: isNew ? 'mcq' : (Math.random() > 0.5 ? 'mcq' : 'theory'),
    difficulty: 'Easy',
    tags: '',
  });
  const [data, setData] = useState(
    meta.type === 'mcq'
      ? { prompt: '', options: [{ id: 'a', text: '' }], correct: null, explanation: '' }
      : { prompt: '', answerGuide: '', maxScore: 5 }
  );

  const setMetaVal = (k, v) => setMeta((m) => ({ ...m, [k]: v }));

  const onSave = () => {
    // Placeholder for API save
    alert('Question saved (mock).');
    if (isNew) {
      nav('/admin/questions');
    }
  };

  const onPublish = () => {
    alert('Question published (mock).');
  };

  const editor = useMemo(() => {
    if (meta.type === 'mcq') {
      return <MCQEditor value={data} onChange={setData} />;
    }
    return <TheoryEditor value={data} onChange={setData} />;
  }, [meta.type, data]);

  const preview = useMemo(() => {
    return (
      <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{meta.title || '(Untitled)'}</div>
        <div style={{ color: 'var(--text-secondary)' }}>Type: {meta.type} · Difficulty: {meta.difficulty}</div>
        <div className="hr" />
        {meta.type === 'mcq' ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>{data.prompt || 'Enter the question prompt in the editor tab.'}</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {(data.options || []).map((o, idx) => (
                <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" disabled />
                  <span>{String.fromCharCode(65 + idx)}.</span>
                  <span>{o.text || '(option)'}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>{data.prompt || 'Enter the question prompt in the editor tab.'}</div>
            <textarea rows={5} placeholder="Candidate response area (preview)" disabled style={{ padding: 12, borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }} />
          </div>
        )}
      </div>
    );
  }, [meta, data]);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card
        title={isNew ? 'Create Question' : `Edit Question - ${id}`}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={() => nav('/admin/questions')}>Back</Button>
            <Button variant="secondary" onClick={onSave}>Save</Button>
            <Button onClick={onPublish}>Publish</Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <TextField label="Title" name="title" value={meta.title} onChange={(v) => setMetaVal('title', v)} required />
            <SelectField
              label="Type"
              name="type"
              value={meta.type}
              onChange={(v) => setMetaVal('type', v)}
              options={[
                { value: 'mcq', label: 'MCQ' },
                { value: 'theory', label: 'Theory' },
              ]}
            />
            <SelectField
              label="Difficulty"
              name="difficulty"
              value={meta.difficulty}
              onChange={(v) => setMetaVal('difficulty', v)}
              options={['Easy', 'Medium', 'Hard']}
            />
          </div>
          <TextField label="Tags (comma separated)" name="tags" value={meta.tags} onChange={(v) => setMetaVal('tags', v)} />
          <Tabs
            items={[
              { key: 'editor', label: 'Editor', content: editor },
              { key: 'preview', label: 'Preview', content: preview },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
