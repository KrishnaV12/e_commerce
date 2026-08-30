// ============================================================================
// useProductTable — builds a headless TanStack Table over the loaded rows.
// ----------------------------------------------------------------------------
// TanStack Table is HEADLESS: it manages column definitions, sorting, and row
// models but renders nothing itself. We exploit that: ONE table instance powers
// BOTH the card grid and the compact table view.
//
// Division of labor (documented so it isn't surprising):
//   - The API does search + category/rating filtering + PAGINATION + the
//     PRIMARY sort (the "Sort by" dropdown). React Query caches those pages.
//   - This table adds CLIENT-SIDE column sorting over the ALREADY-LOADED rows
//     (click a header in table view). It also gives us a clean column model to
//     map over when rendering cards in grid view.
// ============================================================================

import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export default function useProductTable(products) {
  // client-side sorting state for the table view's clickable headers
  const [sorting, setSorting] = useState([]);

  // Column definitions describe the DATA, independent of how it is rendered.
  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: 'Item',
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        // numeric sort
        sortingFn: 'basic',
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => `$${info.getValue().toFixed(2)}`,
        sortingFn: 'basic',
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // rows keep a stable identity by product id (important for React keys)
    getRowId: (row) => String(row.id),
  });

  return table;
}
