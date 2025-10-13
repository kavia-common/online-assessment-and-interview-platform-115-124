import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FullscreenGuard from '../../components/test/FullscreenGuard';
import AntiCheatGuard from '../../components/test/AntiCheatGuard';
import CountdownTimer from '../../components/test/CountdownTimer';
import Button from '../../components/common/Button';
import QuestionRender from '../../components/test/QuestionRender';
import Stepper from '../../components/common/Stepper';
import useBeforeUnloadGuard from '../../hooks/useBeforeUnloadGuard';
import { shuffle } from '../../utils/randomize';

/**
 * PUBLIC_INTERFACE
 * TestRunner executes a test attempt with anti-cheat and timer. It uses mocked
 * questions for this step and provides placeholders for backend sync.
 */
export default function TestRunner() {
  const { testId } = useParams();
  const [params] = useSearchParams();
  const session = params.get('session') || 'local';
  const nav = useNavigate();

  const [totalSeconds] = useState(10 * 60); // 10 mins placeholder
  const [violations, setViolations] = useState(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useBeforeUnloadGuard(true);

  // Placeholder question bank
  const questions = useMemo(() => {
    const base = [
      { id: 'q1', type: 'mcq', title: 'What is React?', description: 'Choose the best answer.', options: ['A CSS framework', 'A UI library', 'A DBMS', 'An operating system'], seed: 11 },
      { id: 'q2', type: 'theory', title: 'Explain virtual DOM', description: 'Short description is fine.' },
      { id: 'q3', type: 'mcq', title: 'Which hook manages state?', description: '', options: ['useMemo', 'useEffect', 'useState', 'useRef'], seed: 3 },
    ];
    return shuffle(base);
  }, []);

  const steps = useMemo(() => ['Launch', 'Run', 'Summary'], []);
  const total = questions.length;
  const current = questions[index];
  const progress = `${index + 1} / ${total}`;

  const onExpire = () => {
    handleSubmit(true);
  };

  const recordViolation = () => setViolations((v) => v + 1);

  const setAnswer = (qid, value) => {
    setAnswers((a) => ({ ...a, [qid]: value }));
  };

  const next = () => setIndex((i) => Math.min(i + 1, total - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = (auto = false) => {
    setSubmitted(true);
    // Placeholder: send submission to backend
    // e.g., apiClient.post('/tests/submit', { testId, session, answers, auto });
    setTimeout(() => {
      nav(`/candidate/tests/summary/${testId}?session=${session}`, { replace: true, state: { answers, violations, auto } });
    }, 400);
  };

  // Keyboard nav for convenience
  const containerRef = useRef(null);
  useEffect(() => {
    const key = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  return (
    <div className="container" ref={containerRef} style={{ display: 'grid', gap: 16 }}>
      <Stepper steps={steps} current={1} />
      <FullscreenGuard>
        <AntiCheatGuard onTabHidden={recordViolation} onIdle={recordViolation}>
          <div className="card p-16" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>Test: {testId}</div>
            <div style={{ color: 'var(--text-muted)' }}>Session: {session}</div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ color: 'var(--text-secondary)' }}>Question {progress}</div>
              <CountdownTimer seconds={totalSeconds} onExpire={onExpire} />
              <div style={{ color: 'var(--color-error)', fontWeight: 600 }}>Violations: {violations}</div>
              <Button variant="secondary" onClick={() => handleSubmit(false)} disabled={submitted}>Submit</Button>
            </div>
          </div>

          <QuestionRender
            question={current}
            answer={answers[current?.id]}
            onAnswer={(val) => setAnswer(current.id, val)}
          />

          <div className="mt-16" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="ghost" onClick={prev} disabled={index === 0}>Previous</Button>
            <Button onClick={next} disabled={index === total - 1}>Next</Button>
          </div>
        </AntiCheatGuard>
      </FullscreenGuard>
    </div>
  );
}
