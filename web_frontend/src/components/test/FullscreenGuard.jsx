import React, { useRef } from 'react';
import useFullscreen from '../../hooks/useFullscreen';
import Button from '../common/Button';

/**
 * PUBLIC_INTERFACE
 * FullscreenGuard shows a prompt to enter fullscreen and renders children once active.
 */
export default function FullscreenGuard({ children }) {
  const ref = useRef(null);
  const { isFullscreen, request, exit } = useFullscreen(ref);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {!isFullscreen ? (
        <div className="card p-24" style={{ display: 'grid', gap: 12 }}>
          <strong>Enter Fullscreen to Continue</strong>
          <p style={{ color: 'var(--text-secondary)' }}>
            For a distraction-free and secure test environment, please enable fullscreen mode.
          </p>
          <div className="flex gap-12">
            <Button onClick={request}>Enter Fullscreen</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-16" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={exit}>Exit Fullscreen</Button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
