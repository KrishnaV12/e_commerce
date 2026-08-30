// =============================================================================
// mockApi.js — simulates a REST endpoint. Returns a Promise that resolves after
// an artificial delay so we can see React Query's loading/caching behaviour and
// the image skeletons. Swap this module for real `fetch` calls and the rest of
// the app (hooks, store, components) doesn't need to change.
// =============================================================================

import { PRODUCTS, CATEGORIES } from '../data/products.js';

// Utility: resolve after `ms`, simulating a round-trip.
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * GET /products — returns the full catalogue.
 * We fetch everything ONCE and do filtering/sorting/pagination on the client
 * (via TanStack Table). React Query then caches this response so re-mounts and
 * re-renders don't trigger new network calls.
 */
export async function fetchProducts() {
  await delay(700); // pretend the network took 700ms

  // Uncomment to test React Query's retry/error UI:
  // if (Math.random() < 0.2) throw new Error('Network hiccup — please retry.');

  return {
    products: PRODUCTS,
    categories: CATEGORIES,
    total: PRODUCTS.length,
  };
}
