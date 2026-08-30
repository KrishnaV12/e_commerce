// ============================================================================
// useThrottledCallback — returns a version of a callback that runs AT MOST once
// per `limit` ms, no matter how often it is invoked.
// ----------------------------------------------------------------------------
// DEBOUNCE vs THROTTLE (both are used in this app, on purpose):
//   - debounce = "wait until it stops" (search box: fire after typing pauses)
//   - throttle = "at a steady max rate" (scroll: fire at most every 200ms)
//
// The scroll listener that powers infinite loading can fire dozens of times a
// second. Throttling it keeps the work bounded and the scroll buttery. We use
// a trailing edge call so the final scroll position is never missed.
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';

export default function useThrottledCallback(callback, limit = 200) {
  const lastRun = useRef(0);       // timestamp of the last real invocation
  const trailing = useRef(null);   // pending trailing timeout
  const cbRef = useRef(callback);

  // keep the latest callback without changing the throttled fn identity
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  // cleanup any pending trailing call on unmount
  useEffect(() => () => clearTimeout(trailing.current), []);

  return useCallback(
    (...args) => {
      const now = Date.now();
      const remaining = limit - (now - lastRun.current);

      if (remaining <= 0) {
        // enough time has passed — run immediately (leading edge)
        lastRun.current = now;
        cbRef.current(...args);
      } else {
        // too soon — schedule a single trailing call for the end of the window
        clearTimeout(trailing.current);
        trailing.current = setTimeout(() => {
          lastRun.current = Date.now();
          cbRef.current(...args);
        }, remaining);
      }
    },
    [limit],
  );
}
