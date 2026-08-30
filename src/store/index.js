// =============================================================================
// store/index.js — assembles the Redux store and wires up localStorage
// persistence for favorites.
//
// PERSISTENCE STRATEGY: instead of a heavy library, we subscribe to the store
// and, whenever the favorites list changes, write it to localStorage. A tiny
// guard avoids redundant writes. This keeps favorites across reloads (an
// "Additional Challenge" from the brief).
// =============================================================================

import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, { FAVORITES_STORAGE_KEY } from './favoritesSlice.js';
import filtersReducer from './filtersSlice.js';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    filters: filtersReducer,
  },
});

// Persist favorites on change (only when they actually differ).
let lastSerialized;
store.subscribe(() => {
  const ids = store.getState().favorites.ids;
  const serialized = JSON.stringify(ids);
  if (serialized !== lastSerialized) {
    lastSerialized = serialized;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, serialized);
    } catch {
      /* storage full / unavailable — fail silently */
    }
  }
});
