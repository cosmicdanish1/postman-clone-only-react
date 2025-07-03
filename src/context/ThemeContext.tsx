import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
type AccentColor = 'green' | 'blue' | 'cyan' | 'purple' | 'yellow' | 'orange' | 'red' | 'pink';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  setTheme: () => {},
  accent: 'blue',
  setAccent: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
  const [accent, setAccent] = useState<AccentColor>(() => (localStorage.getItem('accent') as AccentColor) || 'blue');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const accentMap: Record<AccentColor, string> = {
      green: '#22c55e',
      blue: '#2563eb',
      cyan: '#06b6d4',
      purple: '#7c3aed',
      yellow: '#eab308',
      orange: '#f59e42',
      red: '#ef4444',
      pink: '#ec4899',
    };
    root.style.setProperty('--accent', accentMap[accent]);
    localStorage.setItem('accent', accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 