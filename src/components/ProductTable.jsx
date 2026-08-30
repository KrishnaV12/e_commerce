// ============================================================================
// ProductTable — the compact "table view", rendered from TanStack Table.
// ----------------------------------------------------------------------------
// This is where TanStack Table is most visible: real, clickable, sortable
// column headers. Sorting here is CLIENT-SIDE over the currently loaded rows
// (handled entirely by the headless table's getSortedRowModel). flexRender is
// TanStack's helper to render a column's header/cell definition.
// ============================================================================

import { flexRender } from '@tanstack/react-table';
import LazyImage from './LazyImage';
import Rating from './Rating';
import useFavorites from '../hooks/useFavorites';
import './ProductTable.css';

export default function ProductTable({ table }) {
  const { isFavorite, toggle } = useFavorites();

  return (
    <div className="ptable__wrap">
      <table className="ptable">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const dir = header.column.getIsSorted(); // false | 'asc' | 'desc'
                return (
                  <th
                    key={header.id}
                    className={canSort ? 'is-sortable' : ''}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {canSort && (
                      <span className="ptable__arrow">
                        {dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '↕'}
                      </span>
                    )}
                  </th>
                );
              })}
              <th aria-label="Favorite" />
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const p = row.original;
            const fav = isFavorite(p.id);
            return (
              <tr key={row.id} className={fav ? 'is-fav' : ''}>
                <td className="ptable__thumb">
                  <LazyImage src={p.image} alt={p.name} />
                </td>
                <td className="ptable__name">{p.name}</td>
                <td>{p.category}</td>
                <td><Rating value={p.rating} reviews={p.reviews} /></td>
                <td className="ptable__price">${p.price.toFixed(2)}</td>
                <td>
                  <button
                    className={`ptable__fav ${fav ? 'is-on' : ''}`}
                    aria-pressed={fav}
                    aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => toggle(p.id)}
                  >
                    ♥
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
