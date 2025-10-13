import React from 'react';
import TextArea from '../common/forms/TextArea';
import TextField from '../common/forms/TextField';
import OptionEditor from './OptionEditor';

/**
 * PUBLIC_INTERFACE
 * MCQEditor - Editor for MCQ questions with prompt, options, correct answer, and explanation.
 */
export default function MCQEditor({ value, onChange }) {
  const v = value || { prompt: '', options: [{ id: 'a', text: '' }], correct: null, explanation: '' };
  const set = (patch) => onChange?.({ ...v, ...patch });

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <TextArea label="Prompt" name="prompt" rows={4} value={v.prompt} onChange={(t) => set({ prompt: t })} required />
      <OptionEditor options={v.options} correct={v.correct} onChange={(o) => set(o)} />
      <TextField label="Explanation (optional)" name="explanation" value={v.explanation} onChange={(t) => set({ explanation: t })} />
    </div>
  );
}
