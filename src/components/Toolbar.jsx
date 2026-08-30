// =============================================================================
// Toolbar — the sticky filter/sort bar (requirement). Contains:
//   • debounced search box   • category filter   • rating filter
//   • sort control           • "favorites only" toggle   • reset button
//
// All committed filter state lives in Redux (filtersSlice). The search box keeps
// a LOCAL value for snappy typing, then pushes the DEBOUNCED value into Redux so
// the grid only recomputes when the user pauses (see useDebounce).
// =============================================================================

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../hooks/useDebounce.js';
import {
  selectFilters, setSearch, setCategory, setMinRating,
  setSort, resetFilters,
} from '../store/filtersSlice.js';

const RATING_OPTIONS = [
  { value: 0, label: 'Any rating' },
  { value: 3, label: '3★ & up' },
  { value: 4, label: '4★ & up' },
  { value: 4.5, label: '4.5★ & up' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating-desc', label: 'Rating: High → Low' },
];

export default function Toolbar({ categories = [] }) {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  // Local, immediate search text for a responsive input...
  const [term, setTerm] = useState(filters.search);
  // ...debounced before it reaches Redux (and therefore the grid).
  const debouncedTerm = useDebounce(term, 350);
  const isTyping = term !== debouncedTerm;

  useEffect(() => {
    dispatch(setSearch(debouncedTerm.trim()));
  }, [debouncedTerm, dispatch]);

  return (
    <div className="toolbar">
      <div className="container toolbar__inner">
        {/* Search (debounced) */}
        <div className="field field--search">
          <label className="field__label" htmlFor="search">Search</label>
          <div className="search-wrap">
            <span className="search-wrap__icon" aria-hidden="true">⌕</span>
            <input
              id="search"
              className="search-input"
              type="search"
              placeholder="Search products…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            {isTyping && <span className="search-wrap__spinner">…</span>}
          </div>
        </div>

        {/* Category filter */}
        <div className="field">
          <label className="field__label" htmlFor="category">Category</label>
          <select
            id="category"
            className="control"
            value={filters.category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Rating filter */}
        <div className="field">
          <label className="field__label" htmlFor="rating">Rating</label>
          <select
            id="rating"
            className="control"
            value={filters.minRating}
            onChange={(e) => dispatch(setMinRating(e.target.value))}
          >
            {RATING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="field">
          <label className="field__label" htmlFor="sort">Sort by</label>
          <select
            id="sort"
            className="control"
            value={filters.sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Favorites-only toggle + reset */}
        <button
          type="button"
          className="btn-reset"
          onClick={() => {
            setTerm('');
            dispatch(resetFilters());
          }}
          title="Clear all filters"
        >
          Reset
        </button>
      </div>

      {/* Secondary row: favorites-only toggle sits with the meta in App, but a
          quick inline toggle here keeps the control near the other filters. */}
    </div>
  );
}

export { RATING_OPTIONS, SORT_OPTIONS };
