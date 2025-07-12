import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export type Theme = 'light' | 'dark' | 'black' | 'system';

/**
 * Hook that provides theme-related classes and utilities
 * @returns {Object} An object containing:
 *   - themeClass: The current theme class (e.g., 'theme-dark', 'theme-black', or '' for light)
 *   - theme: The current resolved theme ('light' | 'dark' | 'black')
 *   - isDarkMode: Boolean indicating if the current theme is dark
 *   - isSystemTheme: Boolean indicating if system theme is being used
 *   - searchBarClass: Styles for search bars based on theme
 *   - textLightClass: Light text styles based on theme
 *   - textClass: Regular text styles based on theme
 *   - kbdClass: Keyboard key styles based on theme
 *   - appNameClass: App name text color based on theme
 *   - borderClass: Border styles based on theme
 *   - buttonBgClass: Button background colors based on theme
 */
function useThemeClass() {
  const theme = useSelector((state: RootState) => state.theme.theme) as Theme;
  const [systemTheme, setSystemTheme] = useState<Theme>('light');
  
  // Detect system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    };
    
    // Set initial value
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  // Determine the effective theme (resolves 'system' to actual theme)
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  
  // Memoize all theme-based classes to prevent unnecessary recalculations
  const themeStyles = useMemo(() => {
    const themeClass = (() => {
      switch (effectiveTheme) {
        case 'dark':
          return 'theme-dark';
        case 'black':
          return 'theme-black';
        case 'light':
        default:
          return ''; // light is default, no class needed
      }
    })();

    const searchBarClass =
      effectiveTheme === 'black'
        ? 'bg-black hover:bg-zinc-900'
        : effectiveTheme === 'light'
        ? 'bg-white border border-gray-200 hover:bg-gray-100'
        : 'bg-neutral-800 hover:bg-neutral-900';

    const textLightClass =
      effectiveTheme === 'light'
        ? 'text-gray-700 hover:text-black'
        : 'text-gray-500 hover:text-gray-100';

    const textClass =
      effectiveTheme === 'light'
        ? 'text-black hover:text-gray-700'
        : 'text-white hover:text-gray-300';

    const kbdClass =
      effectiveTheme === 'light'
        ? 'bg-gray-200 text-gray-800 border border-gray-300'
        : 'bg-[#1f1f1f] text-gray-400 border border-white/10';

    const appNameClass = effectiveTheme === 'light' ? 'text-black' : 'text-white';

    const borderClass =
      effectiveTheme === 'black'
        ? 'border-b border-neutral-800'
        : effectiveTheme === 'light'
        ? 'border-b border-gray-200'
        : 'border-b border-neutral-700';

    const buttonBgClass = effectiveTheme === 'light' ? 'bg-[#F9FAFB]' : 'bg-[#1C1C1E]';

    return {
      themeClass,
      searchBarClass,
      textLightClass,
      textClass,
      kbdClass,
      appNameClass,
      borderClass,
      buttonBgClass,
    };
  }, [effectiveTheme]);
  
  return {
    ...themeStyles,
    theme: effectiveTheme,
    isDarkMode: effectiveTheme !== 'light',
    isSystemTheme: theme === 'system',
  };
}

export default useThemeClass;
