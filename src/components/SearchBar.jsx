// ============================================================================
// SearchBar — instant typing, debounced querying.
// ----------------------------------------------------------------------------
// The <input> is controlled by LOCAL state so typing is always snappy. We run
// that local value through useDebounce and only dispatch the SETTLED value to
// Redux. Redux -> React Query key -> one network request per pause in typing.
// This is the "use debounce for search" requirement wired end to end.
// ============================================================================

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '../hooks/useDebounce';
import { setSearch, selectFilters } from '../store/filtersSlice';
import './SearchBar.css';

export default function SearchBar() {
  const dispatch = useDispatch();
  const { search } = useSelector(selectFilters);

  // local, immediate value for the input
  const [text, setText] = useState(search);
  // settles 400ms after the user stops typing
  const debounced = useDebounce(text, 400);

  // push settled value into Redux (only when it actually changed)
  useEffect(() => {
    if (debounced !== search) dispatch(setSearch(debounced));
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep local input in sync if search is cleared elsewhere (e.g. "Clear all")
  useEffect(() => {
    if (search === '' && text !== '') setText('');
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="search">
      <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input
        type="search"
        className="search__input"
        placeholder="Search fresh produce, bakery, pantry…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Search products"
      />
      {/* a tiny "pending" dot while the debounce hasn't settled yet */}
      {text !== debounced && <span className="search__pending" aria-hidden="true" />}
    </div>
  );
}
