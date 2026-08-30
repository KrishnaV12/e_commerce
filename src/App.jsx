// =============================================================================
// App — the shell: header (brand, favorites pill, theme toggle), the sticky
// Toolbar, and the ProductListing feature.
//
// THEME PERSISTENCE: the light/dark green choice is stored via useLocalStorage
// and applied as a data-theme attribute on <html>. Because every color comes
// from CSS variables (variables.css), flipping this one attribute recolors the
// entire UI consistently — and the choice survives reloads.
// =============================================================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useProducts } from './hooks/useProducts.js';
import { selectFavoriteCount } from './store/favoritesSlice.js';
import { selectFilters, toggleFavoritesOnly } from './store/filtersSlice.js';
import Toolbar from './components/Toolbar.jsx';
import ProductListing from './features/ProductListing.jsx';

export default function App() {
  const dispatch = useDispatch();
  const favCount = useSelector(selectFavoriteCount);
  const filters = useSelector(selectFilters);

  // Persisted theme ('light' | 'dark'), applied to <html data-theme>.
  const [theme, setTheme] = useLocalStorage('greenshop.theme', 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Categories come from the cached query so the filter reflects real data.
  const { data } = useProducts();
  const categories = data?.categories ?? [];

  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__row">
          <div className="brand">
            <span className="brand__mark">₹</span>
            <div>
              <div className="brand__name">E-Commerce Listing</div>
              <div className="brand__tag">Sustainably sourced goods</div>
            </div>
          </div>

          <div className="header-actions">
            {/* Clicking the pill toggles the "favorites only" filter */}
            <button
              type="button"
              className="fav-pill"
              aria-pressed={filters.favoritesOnly}
              onClick={() => dispatch(toggleFavoritesOnly())}
            >
              ♥ Favorites
              <span className="fav-pill__count">{favCount}</span>
            </button>

            <button
              type="button"
              className="theme-toggle"
              aria-label="Toggle color theme"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? '☾' : '☀'}
            </button>
          </div>
        </div>
      </header>

      <Toolbar categories={categories} />

      <main className="container" style={{ paddingBottom: 40 }}>
        <ProductListing />
      </main>

      <footer className="site-footer container">
        E-Commerce Listing · Redux · React Query · TanStack Table · pure CSS
      </footer>
    </div>
  );
}
