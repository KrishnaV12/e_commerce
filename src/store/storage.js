// ============================================================================
// storage.js — tiny, safe localStorage wrapper
// ----------------------------------------------------------------------------
// Reading/writing localStorage can throw (private mode, quota, SSR). We wrap it
// so a storage failure NEVER crashes the app — persistence is a nice-to-have,
// not a hard dependency.
// ============================================================================

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore write failures */
  }
}
