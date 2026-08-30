// ============================================================================
// useCategories — cached list of category names for the filter rail.
// ----------------------------------------------------------------------------
// Separate query so it is fetched once and cached "forever" (staleTime:
// Infinity) — category lists rarely change, so we never refetch them.
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/productsApi';

export default function useCategories() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity, // categories are effectively static
  });
  return { categories: data, isLoading };
}
