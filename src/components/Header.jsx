// ============================================================================
// Header — brand, search, and the theme toggle.
// ----------------------------------------------------------------------------
// The theme toggle flips light/dark green via useTheme; the choice is persisted
// (localStorage) so the palette is remembered across reloads. The search box
// lives up here so it's always reachable.
// ============================================================================

import SearchBar from './SearchBar';
import useTheme from '../hooks/useTheme';
import './Header.css';

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <div className="header__inner">
        <a className="brand" href="#top" aria-label="home">
          <span className="brand__mark" aria-hidden="true">🌿</span>
          <span className="brand__name">E-Commerce Listing</span>
        </a>

        <SearchBar />

        <button
          className="header__theme"
          onClick={toggle}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
