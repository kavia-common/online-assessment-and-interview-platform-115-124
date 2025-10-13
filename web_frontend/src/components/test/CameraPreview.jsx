import React, { useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * CameraPreview renders a video element bound to a MediaStream.
 */
export default function CameraPreview({ stream, muted = true, mirrored = true, width = 200, height = 150 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (stream) {
      v.srcObject = stream;
      v.play().catch(() => {});
    } else {
      v.srcObject = null;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      muted={muted}
      playsInline
      style={{
        width,
        height,
        borderRadius: 10,
        border: '1px solid var(--border-color)',
        background: '#000',
        transform: mirrored ? 'scaleX(-1)' : 'none',
        objectFit: 'cover',
        boxShadow: 'var(--shadow-sm)',
      }}
    />
  );
}
