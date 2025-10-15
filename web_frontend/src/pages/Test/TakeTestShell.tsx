import React from 'react';
import { enterFullscreen, exitFullscreen, isFullscreen } from '../../utils/fullscreen.ts';
import { useEventLogger } from '../../hooks/useEventLogger.ts';
import apiClient from '../../services/apiClient';
import { endpoints } from '../../services/endpoints';

const TakeTestShell: React.FC = () => {
  const [started, setStarted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const { log, flush } = useEventLogger({ sessionId: attemptId || undefined });

  const start = async () => {
    const res = await apiClient.post(endpoints.candidate.startTest('default'), {});
    setAttemptId(res.attemptId || res.id);
    setTimeLeft(res.timeLeft || 1800);
    setStarted(true);
    await enterFullscreen(document.documentElement);
    log('test_start', {});
  };

  React.useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [started]);

  // Basic anti-cheat listeners
  React.useEffect(() => {
    const onBlur = () => log('window_blur', {});
    const onFocus = () => log('window_focus', {});
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      log('copy_attempt', {});
    };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('copy', onCopy as any);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('copy', onCopy as any);
    };
  }, [log]);

  // Periodic heartbeat
  React.useEffect(() => {
    if (!started || !attemptId) return;
    const hb = setInterval(() => {
      apiClient.post(endpoints.candidate.heartbeat(attemptId), { ts: Date.now() }).catch(() => {});
    }, 15000);
    return () => clearInterval(hb);
  }, [started, attemptId]);

  // Auto finish at zero
  React.useEffect(() => {
    if (timeLeft === 0 && started && attemptId) {
      apiClient.post(endpoints.candidate.finishAttempt(attemptId), {}).finally(() => {
        flush();
        if (isFullscreen()) exitFullscreen();
        setStarted(false);
      });
    }
  }, [timeLeft, started, attemptId, flush]);

  return (
    <div className="p-4">
      {!started ? (
        <button onClick={start} className="btn btn-primary">Start Test</button>
      ) : (
        <div>
          <div className="mb-3">Time Left: {timeLeft}s</div>
          <div className="card">Question area (placeholder)</div>
        </div>
      )}
    </div>
  );
};

export default TakeTestShell;
