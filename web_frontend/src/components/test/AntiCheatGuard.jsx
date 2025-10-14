import React, { useEffect } from 'react';
import { useEventLogger } from '../../hooks/useEventLogger';

/**
 * PUBLIC_INTERFACE
 * AntiCheatGuard attaches listeners and logs via useEventLogger.
 */
export default function AntiCheatGuard({ sessionId }) {
  const { logEvent } = useEventLogger(sessionId);

  useEffect(() => {
    const onBlur = () => logEvent('window_blur');
    const onFocus = () => logEvent('window_focus');
    const onVisibility = () => logEvent(document.hidden ? 'tab_hidden' : 'tab_visible');
    const onCopy = (e) => { logEvent('copy'); e.preventDefault(); };
    const onPaste = (e) => { logEvent('paste'); e.preventDefault(); };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
    };
  }, [logEvent]);

  return null;
}
