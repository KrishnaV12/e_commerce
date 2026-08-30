// ============================================================================
// uiSlice — global UI preferences. Right now: the color THEME.
// ----------------------------------------------------------------------------
// The theme name ('light' | 'dark') is persisted so the user's chosen green
// scheme survives reloads. This is the "keep color persistence across all UI"
// requirement taken literally: not only are colors centralized as tokens
// (theme.css), the *choice* of palette is remembered.
// ============================================================================

import { createSlice } from '@reduxjs/toolkit';
import { loadState } from './storage';

export const THEME_KEY = 'verdant.theme.v1';

const initialState = {
  theme: loadState(THEME_KEY, 'light'),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;

export const selectTheme = (s) => s.ui.theme;
