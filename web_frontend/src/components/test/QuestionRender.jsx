import React from 'react';
import OptionsShuffle from './OptionsShuffle';

/**
 * PUBLIC_INTERFACE
 * QuestionRender renders MCQ or theory type question shells.
 */
export default function QuestionRender({ question, answer, onAnswer }) {
  if (!question) return null;

  if (question.type === 'mcq') {
    return (
      <div className="card p-24" style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 600 }}>{question.title}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{question.description}</div>
        <OptionsShuffle
          options={question.options || []}
          value={answer}
          onChange={onAnswer}
          seed={question.seed}
          name={`q-${question.id}`}
        />
      </div>
    );
  }

  // Default to theory/free-text placeholder
  return (
    <div className="card p-24" style={{ display: 'grid', gap: 12 }}>
      <div style={{ fontWeight: 600 }}>{question.title}</div>
      <div style={{ color: 'var(--text-secondary)' }}>{question.description}</div>
      <textarea
        placeholder="Type your answer here..."
        value={answer || ''}
        onChange={(e) => onAnswer?.(e.target.value)}
        rows={8}
        style={{
          padding: 12,
          borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          resize: 'vertical',
        }}
      />
    </div>
  );
}
