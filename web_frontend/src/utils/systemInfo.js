//
// PUBLIC_INTERFACE
// systemInfo utilities to capture device, browser and permission state
//
/**
 * PUBLIC_INTERFACE
 * getSystemInfo collects non-PII environment details and permission prompts.
 * Note: Camera/mic permission requests should be user-initiated; we expose
 * helper to request on demand during test launch.
 */
export async function getSystemInfo() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const win = typeof window !== 'undefined' ? window : {};
  const screen = win.screen || {};

  let connection = null;
  try {
    const c = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (c) {
      connection = {
        effectiveType: c.effectiveType,
        downlink: c.downlink,
        rtt: c.rtt,
        saveData: c.saveData,
      };
    }
  } catch {
    // ignore
  }

  let permissions = {};
  try {
    if (nav.permissions?.query) {
      const kinds = ['camera', 'microphone', 'clipboard-read', 'clipboard-write', 'geolocation', 'notifications'];
      const results = await Promise.allSettled(kinds.map((name) => nav.permissions.query({ name })));
      results.forEach((res, idx) => {
        permissions[kinds[idx]] = res.value?.state || 'unknown';
      });
    }
  } catch {
    // ignore
  }

  return {
    userAgent: nav.userAgent || 'unknown',
    language: nav.language || 'unknown',
    platform: nav.platform || 'unknown',
    hardwareConcurrency: nav.hardwareConcurrency || null,
    deviceMemory: nav.deviceMemory || null,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelRatio: win.devicePixelRatio || 1,
    },
    timezone: Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || 'unknown',
    connection,
    permissions,
  };
}

/**
 * PUBLIC_INTERFACE
 * requestCameraStream asks for user media and returns the stream or throws.
 */
export async function requestCameraStream(constraints = { video: true, audio: false }) {
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error('Media devices not supported');
  }
  return navigator.mediaDevices.getUserMedia(constraints);
}
