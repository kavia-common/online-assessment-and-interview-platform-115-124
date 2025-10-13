import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CameraPreview from '../../components/test/CameraPreview';
import { getSystemInfo, requestCameraStream } from '../../utils/systemInfo';
import Stepper from '../../components/common/Stepper';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TestLauncher prepares the candidate for a test: checks system info,
 * requests camera, and proceeds to TestRunner with a session token.
 */
export default function TestLauncher() {
  const [info, setInfo] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [params] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getSystemInfo();
        setInfo(res);
      } catch {
        // ignore
      }
    })();
  }, []);

  const requestMedia = async () => {
    setError('');
    setBusy(true);
    try {
      const s = await requestCameraStream({ video: true, audio: false });
      setStream(s);
    } catch (e) {
      setError(e?.message || 'Unable to access camera');
    } finally {
      setBusy(false);
    }
  };

  const proceed = () => {
    const testId = params.get('testId') || 'demo';
    const sessionId = 'sess_' + Math.random().toString(36).slice(2, 9);
    // Placeholder: In a real app, request a session token from backend
    nav(`/candidate/tests/run/${testId}?session=${sessionId}`, { replace: false, state: { infoCaptured: true } });
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Stepper steps={['Launch', 'Run', 'Summary']} current={0} />
      <Card title="Test Pre-check">
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>System Details</div>
            <div className="card p-16" style={{ display: 'grid', gap: 8 }}>
              <div><strong>Browser:</strong> {info?.userAgent || '...'}</div>
              <div><strong>Platform:</strong> {info?.platform || '...'}</div>
              <div><strong>Language:</strong> {info?.language || '...'}</div>
              <div><strong>Screen:</strong> {info?.screen?.width} x {info?.screen?.height}</div>
              <div><strong>Timezone:</strong> {info?.timezone}</div>
              <div><strong>Camera Permission:</strong> {info?.permissions?.camera || 'unknown'}</div>
            </div>
            <div className="mt-16" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Note: This information is collected to ensure compatibility and proctoring. No data is sent in this step.
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Camera Preview</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <CameraPreview stream={stream} />
              <div style={{ display: 'grid', gap: 8 }}>
                <Button onClick={requestMedia} disabled={busy}>{busy ? 'Requesting...' : 'Enable Camera'}</Button>
                <Button variant="secondary" onClick={() => { stream?.getTracks()?.forEach(t => t.stop()); setStream(null); }}>Stop Camera</Button>
              </div>
            </div>
            {error && <div className="mt-16" style={{ color: 'var(--color-error)' }}>{error}</div>}
          </div>
        </div>
        <div className="mt-16" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Link to="/candidate" style={{ alignSelf: 'center' }}>Cancel</Link>
          <Button onClick={proceed} disabled={!info}>Proceed to Test</Button>
        </div>
      </Card>
    </div>
  );
}
