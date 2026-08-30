// =============================================================================
// filtersSlice.js — Redux slice that is the single source of truth for the
// toolbar controls: search text, category, minimum rating, sort order, and a
// "favorites only" toggle. Keeping this in Redux (rather than local component
// state) means any component can read the active filters, and it decouples the
// controls from the grid. These values are later fed into TanStack Table.
// =============================================================================

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',            // already-debounced search term (see useDebounce)
  category: 'All',       // 'All' | one of CATEGORIES
  minRating: 0,          // 0 | 3 | 3.5 | 4 | 4.5
  sort: 'featured',      // 'featured' | 'price-asc' | 'price-desc' | 'rating-desc'
  favoritesOnly: false,  // show only favorited products
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (s, a) => { s.search = a.payload; },
    setCategory: (s, a) => { s.category = a.payload; },
    setMinRating: (s, a) => { s.minRating = Number(a.payload); },
    setSort: (s, a) => { s.sort = a.payload; },
    toggleFavoritesOnly: (s) => { s.favoritesOnly = !s.favoritesOnly; },
    setFavoritesOnly: (s, a) => { s.favoritesOnly = a.payload; },
    resetFilters: () => initialState,
  },
});

export const {
  setSearch, setCategory, setMinRating, setSort,
  toggleFavoritesOnly, setFavoritesOnly, resetFilters,
} = filtersSlice.actions;

export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
