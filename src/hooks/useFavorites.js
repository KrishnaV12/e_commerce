// ============================================================================
// useFavorites — small facade over the favorites slice.
// ----------------------------------------------------------------------------
// Keeps favorites logic in one reusable place so components just call
// isFavorite(id) / toggle(id) without importing selectors + dispatch directly.
// ============================================================================

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFavoriteIds,
  toggleFavorite,
} from '../store/favoritesSlice';

export default function useFavorites() {
  const ids = useSelector(selectFavoriteIds);
  const dispatch = useDispatch();

  // O(1) membership checks via a Set derived from the id array
  const set = useMemo(() => new Set(ids), [ids]);

  const isFavorite = useCallback((id) => set.has(id), [set]);
  const toggle = useCallback((id) => dispatch(toggleFavorite(id)), [dispatch]);

  return { ids, count: ids.length, isFavorite, toggle };
}
