import { createSlice } from '@reduxjs/toolkit';

type Theme = 'system' | 'light' | 'dark' | 'black' | 'light-custom';

type AccentColor = 'green' | 'blue' | 'cyan' | 'purple' | 'yellow' | 'orange' | 'red' | 'pink';

interface ThemeState {
  theme: Theme;
  accentColor: AccentColor;
}

const initialState: ThemeState = {
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  accentColor: (localStorage.getItem('accentColor') as AccentColor) || 'blue',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setAccentColor(state, action) {
      state.accentColor = action.payload;
      localStorage.setItem('accentColor', action.payload);
    },
  },
});

export const { setTheme, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer; 