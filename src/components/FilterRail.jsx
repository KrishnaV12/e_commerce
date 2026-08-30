// ============================================================================
// FilterRail — sticky sidebar of filters (category + minimum rating).
// ----------------------------------------------------------------------------
// All state is in Redux; this component only reads it and dispatches changes.
// On mobile it becomes a slide-in drawer (controlled by `open`/`onClose`).
// Sticky positioning keeps it on screen while the product grid scrolls — the
// "sticky filter/sort bar" requirement.
// ============================================================================

import { useDispatch, useSelector } from 'react-redux';
import useCategories from '../hooks/useCategories';
import {
  selectFilters,
  toggleCategory,
  setMinRating,
  clearFilters,
  selectActiveFilterCount,
} from '../store/filtersSlice';
import './FilterRail.css';

const RATING_OPTIONS = [
  { label: 'Any rating', value: 0 },
  { label: '3.0 & up', value: 3 },
  { label: '4.0 & up', value: 4 },
  { label: '4.5 & up', value: 4.5 },
];

export default function FilterRail({ open, onClose }) {
  const dispatch = useDispatch();
  const { categories: active, minRating } = useSelector(selectFilters);
  const activeCount = useSelector(selectActiveFilterCount);
  const { categories, isLoading } = useCategories();

  return (
    <>
      {/* dim backdrop shown only when the mobile drawer is open */}
      <div
        className={`rail__backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`rail ${open ? 'is-open' : ''}`} aria-label="Filters">
        <div className="rail__head">
          <h2 className="rail__title">Filters</h2>
          {activeCount > 0 && (
            <button className="rail__clear" onClick={() => dispatch(clearFilters())}>
              Clear all
            </button>
          )}
          <button className="rail__close" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>

        {/* --- Category (multi-select checkboxes) --- */}
        <section className="rail__group">
          <h3 className="rail__label">Category</h3>
          {isLoading ? (
            <p className="rail__loading">Loading…</p>
          ) : (
            <ul className="rail__options">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={active.includes(cat)}
                      onChange={() => dispatch(toggleCategory(cat))}
                    />
                    <span className="check__box" aria-hidden="true" />
                    <span className="check__text">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* --- Minimum rating (single-select radios) --- */}
        <section className="rail__group">
          <h3 className="rail__label">Rating</h3>
          <ul className="rail__options">
            {RATING_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <label className="check">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === opt.value}
                    onChange={() => dispatch(setMinRating(opt.value))}
                  />
                  <span className="check__box check__box--radio" aria-hidden="true" />
                  <span className="check__text">{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </>
  );
}
