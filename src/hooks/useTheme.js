// ============================================================================
// useTheme — bridges Redux theme state to the DOM.
// ----------------------------------------------------------------------------
// The palette is selected by the [data-theme] attribute on <html> (see
// theme.css). This hook keeps that attribute in sync with the Redux value and
// exposes a toggle. Because the Redux value is persisted to localStorage, the
// chosen scheme is restored on reload -> color persistence.
// ============================================================================

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, toggleTheme } from '../store/uiSlice';

export default function useTheme() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  // reflect state -> DOM whenever it changes (and on first mount)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggle: () => dispatch(toggleTheme()) };
}
