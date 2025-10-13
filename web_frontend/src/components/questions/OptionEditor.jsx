import React from 'react';
import Button from '../common/Button';
import TextField from '../common/forms/TextField';

/**
 * PUBLIC_INTERFACE
 * OptionEditor renders a list of options with add/remove and marks one as correct.
 */
export default function OptionEditor({ options = [], correct = null, onChange }) {
  const set = (patch) => onChange?.({ options, correct, ...patch });

  const setOption = (idx, text) => {
    const copy = options.map((o, i) => (i === idx ? { ...o, text } : o));
    set({ options: copy });
  };

  const addOption = () => {
    const id = Math.random().toString(36).slice(2, 8);
    set({ options: [...options, { id, text: '' }] });
  };

  const removeOption = (idx) => {
    const copy = options.filter((_, i) => i !== idx);
    const removedWasCorrect = idx === correct;
    set({ options: copy, correct: removedWasCorrect ? null : correct });
  };

  const markCorrect = (idx) => set({ correct: idx });

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {options.map((o, idx) => (
        <div key={o.id || idx} className="card p-16" style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center' }}>
            <input type="radio" name="correct" checked={correct === idx} onChange={() => markCorrect(idx)} />
            <TextField label={`Option ${String.fromCharCode(65 + idx)}`} value={o.text} onChange={(v) => setOption(idx, v)} />
            <Button variant="ghost" onClick={() => removeOption(idx)}>Remove</Button>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={addOption}>Add Option</Button>
      </div>
    </div>
  );
}
