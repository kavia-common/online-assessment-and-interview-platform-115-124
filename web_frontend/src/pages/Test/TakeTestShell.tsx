import React from 'react';
import Stepper from '../../components/common/Stepper';
import { enterFullscreen, exitFullscreen, isFullscreen } from '../../utils/fullscreen';
import { formatMMSS } from '../../utils/time';
import { useEventLogger } from '../../hooks/useEventLogger';
import { useAuth } from '../../hooks/useAuth';
import { useWebsocketStatus } from '../../services/ws';

const steps = [
  { key: 'intro', label: 'Intro' },
  { key: 'test', label: 'Test' },
  { key: 'submit', label: 'Submit' },
];

const TakeTestShell: React.FC = () => {
  const { userId } = useAuth();
  const [started, setStarted] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const { push, startSession, endSession, bufferSize } = useEventLogger();
  const { status } = useWebsocketStatus();

  React.useEffect(() => {
    let timer: any;
    if (started) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [started]);

  const onStart = async () => {
    try {
      await enterFullscreen(document.documentElement);
      startSession('session-123', userId);
      push('test_start');
      setStarted(true);
    } catch (e) {
      push('fullscreen_error', { message: (e as Error).message });
    }
  };

  const onExit = async () => {
    push('test_exit');
    endSession();
    if (isFullscreen()) await exitFullscreen();
    setStarted(false);
    setSeconds(0);
  };

  return (
    <div className="container">
      <h1 className="h1">Take Test</h1>
      <p className="muted">Questions and answers will be randomized.</p>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stepper steps={steps} activeIndex={started ? 1 : 0} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge">WS: {status}</span>
            <span className="badge">Queue: {bufferSize}</span>
            <span className="badge">Timer: {formatMMSS(seconds)}</span>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {!started ? (
            <button className="btn btn-primary" onClick={onStart} aria-label="Start Test">Start Test</button>
          ) : (
            <>
              <button className="btn btn-ghost" disabled aria-label="Previous Question">Prev</button>
              <button className="btn btn-ghost" disabled aria-label="Next Question">Next</button>
              <button className="btn btn-secondary" onClick={onExit} aria-label="Exit Test">Exit</button>
            </>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Fullscreen: {isFullscreen() ? 'On' : 'Off'}</div>
        </div>
      </div>
    </div>
  );
};

export default TakeTestShell;
