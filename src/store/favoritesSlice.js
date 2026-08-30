// =============================================================================
// favoritesSlice.js — Redux Toolkit slice holding the set of favorited product
// IDs. This is CLIENT state (user's choices), which is why it lives in Redux and
// NOT in React Query (React Query is for SERVER state). Favorites are persisted
// to localStorage so they survive reloads — see store/index.js for the wiring.
// =============================================================================

import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'greenshop.favorites';

// Read the persisted favorites synchronously so the very first render is correct.
function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    ids: loadFavorites(), // array of product ids
  },
  reducers: {
    // Toggle a product in/out of favorites.
    toggleFavorite(state, action) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx >= 0) state.ids.splice(idx, 1); // Immer lets us "mutate" safely
      else state.ids.push(id);
    },
    clearFavorites(state) {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export const FAVORITES_STORAGE_KEY = STORAGE_KEY;

// ---- Selectors (memo-friendly, keep components decoupled from state shape) ---
export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectFavoriteCount = (state) => state.favorites.ids.length;
export const selectIsFavorite = (id) => (state) => state.favorites.ids.includes(id);

export default favoritesSlice.reducer;
