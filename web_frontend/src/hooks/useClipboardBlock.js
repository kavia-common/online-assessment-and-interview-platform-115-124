import { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * useClipboardBlock prevents copy, cut, paste and context menu during tests.
 */
export default function useClipboardBlock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener('copy', prevent);
    document.addEventListener('cut', prevent);
    document.addEventListener('paste', prevent);
    document.addEventListener('contextmenu', prevent);
    return () => {
      document.removeEventListener('copy', prevent);
      document.removeEventListener('cut', prevent);
      document.removeEventListener('paste', prevent);
      document.removeEventListener('contextmenu', prevent);
    };
  }, [enabled]);
}
