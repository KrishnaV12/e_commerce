// =============================================================================
// ProductListing — the heart of the app. It orchestrates:
//   1. React Query (useProducts) for the cached server data.
//   2. Redux (filters + favorites) for the user's UI state.
//   3. TanStack Table (HEADLESS) to do the actual filtering + sorting.
//   4. Infinite scroll to reveal results a page at a time.
//
// Why TanStack Table for a *grid*? Its model is headless — it computes filtered
// & sorted rows without rendering any <table>. We take those computed rows and
// render them as cards. This gives us battle-tested, composable filter/sort
// logic instead of hand-written array juggling.
// =============================================================================

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import { useProducts } from '../hooks/useProducts.js';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll.js';
import { selectFilters } from '../store/filtersSlice.js';
import { selectFavoriteIds } from '../store/favoritesSlice.js';
import ProductGrid from '../components/ProductGrid.jsx';

// ---- Custom filter functions for the headless table -------------------------
// Rating: keep rows whose rating >= the selected minimum.
const gteRating = (row, columnId, filterValue) =>
  Number(row.getValue(columnId)) >= Number(filterValue);

// Global search: match against name OR category, case-insensitive.
const searchNameCategory = (row, _columnId, filterValue) => {
  const q = String(filterValue).toLowerCase();
  const name = String(row.original.name).toLowerCase();
  const cat = String(row.original.category).toLowerCase();
  return name.includes(q) || cat.includes(q);
};

// Map the Redux `sort` string → TanStack sorting state.
function toSortingState(sort) {
  switch (sort) {
    case 'price-asc':   return [{ id: 'price', desc: false }];
    case 'price-desc':  return [{ id: 'price', desc: true }];
    case 'rating-desc': return [{ id: 'rating', desc: true }];
    default:            return []; // 'featured' → original order
  }
}

export default function ProductListing() {
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts();
  const filters = useSelector(selectFilters);
  const favoriteIds = useSelector(selectFavoriteIds);

  // Base rows for the table. When "favorites only" is on, we narrow the data
  // set up-front; everything else is handled by the table's filter model.
  const tableData = useMemo(() => {
    const all = data?.products ?? [];
    if (!filters.favoritesOnly) return all;
    const favSet = new Set(favoriteIds);
    return all.filter((p) => favSet.has(p.id));
  }, [data, filters.favoritesOnly, favoriteIds]);

  // Column definitions (memoized as TanStack recommends).
  const columns = useMemo(
    () => [
      { accessorKey: 'name' },
      { accessorKey: 'category', filterFn: 'equalsString' },
      { accessorKey: 'price' },
      { accessorKey: 'rating', filterFn: gteRating },
    ],
    [],
  );

  // Translate Redux filters → TanStack table state.
  const columnFilters = useMemo(() => {
    const cf = [];
    if (filters.category !== 'All') cf.push({ id: 'category', value: filters.category });
    if (filters.minRating > 0) cf.push({ id: 'rating', value: filters.minRating });
    return cf;
  }, [filters.category, filters.minRating]);

  const sorting = useMemo(() => toSortingState(filters.sort), [filters.sort]);

  // Build the headless table. State is fully controlled from Redux-derived values.
  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnFilters, sorting, globalFilter: filters.search },
    globalFilterFn: searchNameCategory,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Final filtered + sorted products (no pagination model → these are all rows).
  const rows = table.getRowModel().rows;
  const processed = useMemo(() => rows.map((r) => r.original), [rows]);

  // Infinite scroll over the processed list. resetKey ensures we jump back to
  // page 1 whenever the active filter/search/sort changes.
  const resetKey = `${filters.search}|${filters.category}|${filters.minRating}|${filters.sort}|${filters.favoritesOnly}`;
  const { visibleCount, hasMore, sentinelRef } = useInfiniteScroll(processed.length, {
    pageSize: 12,
    resetKey,
  });
  const visible = processed.slice(0, visibleCount);

  // ---- Render states ------------------------------------------------------
  if (isLoading) {
    return (
      <div className="grid" aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="state">
        <p className="state__title">Couldn’t load products</p>
        <p>{error?.message || 'Something went wrong.'}</p>
        <button className="btn-reset" onClick={() => refetch()} style={{ marginTop: 12 }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="results-meta">
        <span className="results-meta__count">
          Showing <b>{visible.length}</b> of <b>{processed.length}</b> products
          {isFetching && ' · refreshing…'}
        </span>
        <div className="chips">
          {filters.favoritesOnly && <span className="chip">♥ Favorites only</span>}
          {filters.category !== 'All' && <span className="chip">{filters.category}</span>}
          {filters.minRating > 0 && <span className="chip">{filters.minRating}★ & up</span>}
          {filters.search && <span className="chip">“{filters.search}”</span>}
        </div>
      </div>

      {processed.length === 0 ? (
        <div className="state">
          <p className="state__title">No products match</p>
          <p>Try clearing a filter or searching for something else.</p>
        </div>
      ) : (
        <>
          <ProductGrid products={visible} />
          <div ref={sentinelRef} className="sentinel" />
          {hasMore ? (
            <p className="loading-more">Loading more…</p>
          ) : (
            <p className="end-note">You’ve reached the end · {processed.length} products</p>
          )}
        </>
      )}
    </>
  );
}
