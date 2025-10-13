import React from 'react';
import TextArea from '../common/forms/TextArea';
import TextField from '../common/forms/TextField';

/**
 * PUBLIC_INTERFACE
 * TheoryEditor - Editor for theory/free-text questions with prompt and marking guide.
 */
export default function TheoryEditor({ value, onChange }) {
  const v = value || { prompt: '', answerGuide: '', maxScore: 10 };
  const set = (patch) => onChange?.({ ...v, ...patch });

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <TextArea label="Prompt" rows={5} value={v.prompt} onChange={(t) => set({ prompt: t })} required />
      <TextArea label="Answer Guide (for evaluators)" rows={4} value={v.answerGuide} onChange={(t) => set({ answerGuide: t })} />
      <TextField label="Max Score" type="number" value={v.maxScore} onChange={(t) => set({ maxScore: Number(t) })} />
    </div>
  );
}
