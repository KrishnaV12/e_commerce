// =============================================================================
// useProducts — thin wrapper around TanStack React Query's useQuery for the
// products endpoint. React Query handles: caching, dedupe, background refetch,
// loading/error state, and retries — so we don't hand-roll any of that.
//
// staleTime: how long data is considered "fresh" (no refetch on remount).
// gcTime:    how long an unused cache entry is kept before garbage collection.
// Because the whole catalogue is cached, filtering/sorting/searching happen
// instantly on the client with zero extra network calls.
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/mockApi.js';

export const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 min: treat data as fresh, avoid refetching
    gcTime: 10 * 60 * 1000,   // keep cache 10 min after last use
    retry: 2,                 // auto-retry failed fetches twice
    select: (data) => data,   // place to reshape the payload if needed
  });
}
