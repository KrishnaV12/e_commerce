// =============================================================================
// useDebounce — returns a value that only updates after it has stopped changing
// for `delay` ms. Used on the search box so we don't re-filter the grid on every
// keystroke; the expensive work runs once the user pauses typing.
//
// DEBOUNCE vs THROTTLE:
//   debounce = "wait until things go quiet, then fire once"  → search input
//   throttle = "fire at most once per interval while active" → scroll handler
// =============================================================================

import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Start a timer; if `value` changes again before it fires, the cleanup
    // below cancels it and we start over — that's the debounce.
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
