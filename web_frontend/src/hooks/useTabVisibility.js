import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTabVisibility returns document visibility and increments switch count.
 */
export default function useTabVisibility(onHidden) {
  const [hiddenCount, setHiddenCount] = useState(0);
  const [isHidden, setIsHidden] = useState(document.hidden);

  useEffect(() => {
    const handle = () => {
      const nowHidden = document.hidden;
      setIsHidden(nowHidden);
      if (nowHidden) {
        setHiddenCount((c) => c + 1);
        if (typeof onHidden === 'function') onHidden();
      }
    };
    document.addEventListener('visibilitychange', handle);
    return () => document.removeEventListener('visibilitychange', handle);
  }, [onHidden]);

  return { isHidden, hiddenCount };
}
