// =============================================================================
// useLocalStorage — like useState, but the value is mirrored to localStorage so
// it PERSISTS across reloads. We use it for the color theme (light/dark green),
// which is what gives the app "color persistence across all UI": the chosen
// palette is remembered between sessions.
//
// (Favorites use a separate store-subscription strategy in store/index.js; this
// hook is the generic, reusable version for simple UI values.)
// =============================================================================

import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Write to localStorage whenever the value changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [key, value]);

  // Stable setter that also supports the functional-updater form.
  const set = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  return [value, set];
}
