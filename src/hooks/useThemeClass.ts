import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import useAccentColor from './useAccentColor';

export type Theme = 'light' | 'dark' | 'black' | 'system';

/**
 * Hook that provides theme-related classes and utilities
 * @returns {Object} An object containing:
 *   - themeClass: The current theme class (e.g., 'theme-dark', 'theme-black', or '' for light)
 *   - theme: The current resolved theme ('light' | 'dark' | 'black')
 *   - isDarkMode: Boolean indicating if the current theme is dark
 *   - isSystemTheme: Boolean indicating if system theme is being used
 *   - accentColor: The current accent color hex value
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
  
  // Get the accent color from the useAccentColor hook
  const { current: accentColor } = useAccentColor();
  
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

    const cardBgClass =
      effectiveTheme === 'light'
        ? 'bg-white'
        : effectiveTheme === 'dark'
        ? 'bg-neutral-800'
        : 'bg-black';

    const appNameClass = effectiveTheme === 'light' ? 'text-black' : 'text-white';

    // Thin border class for subtle separators
    const thinBorderClass = effectiveTheme === 'light' 
      ? 'border-gray-200' 
      : effectiveTheme === 'dark' 
        ? 'border-neutral-700' 
        : 'border-neutral-800';

    const borderClass =
      effectiveTheme === 'black'
        ? 'border-b border-neutral-800'
        : effectiveTheme === 'light'
        ? 'border-b border-gray-200'
        : 'border-b border-neutral-700';

    const buttonBgClass = effectiveTheme === 'light' ? 'bg-[#F9FAFB]' : 'bg-[#1C1C1E]';


    const borderRightClass =
  effectiveTheme === 'black'
    ? 'border-r border-neutral-800'
    : effectiveTheme === 'light'
    ? 'border-r border-gray-200'
    : 'border-r border-neutral-700';


    const borderLeftClass =
  effectiveTheme === 'black'
    ? 'border-l border-neutral-800'
    : effectiveTheme === 'light'
    ? 'border-l border-gray-200'
    : 'border-l border-neutral-700';



    return {
      themeClass,
      searchBarClass,
      textLightClass,
      textClass,
      kbdClass,
      cardBgClass,
      appNameClass,
      borderClass,
      thinBorderClass,
      buttonBgClass,
      borderRightClass,
      borderLeftClass,
    };
  }, [effectiveTheme]);
  
  // Generate dynamic accent color classes
  // Note: We need to use the full color values here instead of dynamic classes
  // to work with Tailwind's JIT compiler
  const accentColorClass = {
    // These will be used with style attribute for dynamic colors
    style: {
      '--accent-color': accentColor,
      '--accent-hover': `${accentColor}e6`, // 90% opacity
    },
    // These classes can be used for other styling
    text: 'text-[var(--accent-color)]',
    bg: 'bg-[var(--accent-color)]',
    border: 'border-[var(--accent-color)]',
    hover: 'hover:bg-[var(--accent-hover)]',
    focus: 'focus:ring-[var(--accent-color)]',
  };

  // Generate scrollbar styles based on the current theme
  const scrollbarStyles = `
    /* For Webkit browsers (Chrome, Safari) */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${effectiveTheme === 'light' ? '#f1f1f1' : effectiveTheme === 'dark' ? '#2a2a2a' : '#1a1a1a'};
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${effectiveTheme === 'light' ? '#c1c1c1' : '#555'};
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${effectiveTheme === 'light' ? '#a8a8a8' : '#777'};
    }
    /* For Firefox */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: ${effectiveTheme === 'light' 
        ? '#c1c1c1 #f1f1f1' 
        : effectiveTheme === 'dark' 
          ? '#555 #2a2a2a' 
          : '#666 #1a1a1a'};
    }
  `;

  return {
    ...themeStyles, // This already includes thinBorderClass
    theme: effectiveTheme,
    isDarkMode: effectiveTheme !== 'light',
    isSystemTheme: theme === 'system',
    accentColor,
    accentColorClass,
    scrollbarStyles,
  };
}

export default useThemeClass;
