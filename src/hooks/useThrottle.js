// =============================================================================
// useThrottle — returns a throttled version of a callback that runs at most once
// every `limit` ms, no matter how often it's invoked. Used for the infinite
// scroll listener: scroll events fire dozens of times per second, and we only
// need to check "should I load more?" a few times per second.
// =============================================================================

import { useCallback, useRef } from 'react';

export function useThrottle(callback, limit = 200) {
  const lastRun = useRef(0);          // timestamp of last execution
  const trailing = useRef(null);      // pending trailing-call timer

  return useCallback(
    (...args) => {
      const now = Date.now();
      const remaining = limit - (now - lastRun.current);

      if (remaining <= 0) {
        // Enough time has passed — run immediately (leading edge).
        if (trailing.current) { clearTimeout(trailing.current); trailing.current = null; }
        lastRun.current = now;
        callback(...args);
      } else if (!trailing.current) {
        // Too soon — schedule one trailing call so the final event isn't lost.
        trailing.current = setTimeout(() => {
          lastRun.current = Date.now();
          trailing.current = null;
          callback(...args);
        }, remaining);
      }
    },
    [callback, limit],
  );
}
