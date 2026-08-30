// ============================================================================
// productsApi.js — a fake network layer
// ----------------------------------------------------------------------------
// This pretends to be a REST backend. Every function returns a Promise and
// resolves after an artificial delay, so the UI has real loading/error states
// to handle and React Query has something meaningful to cache.
//
// The endpoint does filtering, sorting AND pagination SERVER-SIDE. That is the
// realistic model: the client sends query params, the server returns just one
// page. React Query then caches each unique (filter -> page) response.
// ============================================================================

import { PRODUCTS, CATEGORIES } from './mockData';

// Simulate variable network latency.
const latency = () => 350 + Math.random() * 400;

// Randomly fail ~4% of the time so the UI's error/retry path is exercised.
const shouldFail = () => Math.random() < 0.04;

function delay(value, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error('Network error — could not reach the store.'));
      else resolve(value);
    }, latency());
  });
}

/**
 * fetchProducts — the main list endpoint.
 *
 * @param {Object}   params
 * @param {number}   params.page        1-based page index
 * @param {number}   params.pageSize    items per page
 * @param {string}   params.search      free-text query (matched on name)
 * @param {string[]} params.categories  category filter (empty = all)
 * @param {number}   params.minRating   minimum star rating (0 = any)
 * @param {string}   params.sort        'relevance' | 'price_asc' | 'price_desc' | 'rating_desc'
 * @param {boolean}  params.favoritesOnly  restrict to a set of ids
 * @param {number[]} params.favoriteIds    ids considered "favorite"
 * @returns {Promise<{items, page, pageSize, total, totalFiltered, hasMore}>}
 */
export function fetchProducts({
  page = 1,
  pageSize = 12,
  search = '',
  categories = [],
  minRating = 0,
  sort = 'relevance',
  favoritesOnly = false,
  favoriteIds = [],
} = {}) {
  // 1) FILTER --------------------------------------------------------------
  const q = search.trim().toLowerCase();
  const favSet = new Set(favoriteIds);

  let filtered = PRODUCTS.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (categories.length && !categories.includes(p.category)) return false;
    if (minRating && p.rating < minRating) return false;
    if (favoritesOnly && !favSet.has(p.id)) return false;
    return true;
  });

  // 2) SORT ----------------------------------------------------------------
  switch (sort) {
    case 'price_asc':
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      filtered = [...filtered].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    default:
      break; // 'relevance' keeps natural order
  }

  // 3) PAGINATE ------------------------------------------------------------
  const totalFiltered = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  const hasMore = start + pageSize < totalFiltered;

  return delay(
    {
      items,
      page,
      pageSize,
      total: PRODUCTS.length,
      totalFiltered,
      hasMore,
    },
    shouldFail(),
  );
}

// Categories endpoint (also async, also cacheable by React Query).
export function fetchCategories() {
  return delay(CATEGORIES);
}
