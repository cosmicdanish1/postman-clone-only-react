import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState } from '../store';

/**
 * Central map of accent key -> hex. Import once, reuse everywhere.
 * All colors should be valid CSS hex colors.
 */
export const ACCENT_COLOR_MAP = {
  green: '#22c55e',
  blue: '#2563eb',
  cyan: '#06b6d4',
  purple: '#7c3aed',
  yellow: '#eab308',
  orange: '#f59e42',
  red: '#ef4444',
  pink: '#ec4899',
} as const;



export type AccentKey = keyof typeof ACCENT_COLOR_MAP;

export const DEFAULT_ACCENT_COLOR: AccentKey = 'blue';

/**
 * Returns the accent color hex for a given key
 * @param key The accent color key (e.g., 'green', 'blue')
 * @returns The hex color string (e.g., "#22c55e")
 */
function getAccentColor(key: AccentKey = DEFAULT_ACCENT_COLOR): string {
  return ACCENT_COLOR_MAP[key] || ACCENT_COLOR_MAP[DEFAULT_ACCENT_COLOR];
}

/**
 * Hook that provides accent color functionality
 * @returns An object containing:
 *   - current: The current accent color hex
 *   - get: Function to get a specific accent color by key
 *   - colors: Array of all available accent colors with their keys and hex values
 *   - keys: Array of all available accent color keys
 */
function useAccentColor() {
  const accentKey = useSelector((state: RootState) => state.theme.accentColor) as AccentKey;
  
  // Memoize the current accent color to prevent unnecessary recalculations
  const currentColor = useMemo(() => {
    return getAccentColor(accentKey);
  }, [accentKey]);
  
  // Memoize the colors array to prevent unnecessary recreations
  const colors = useMemo(() => {
    return Object.entries(ACCENT_COLOR_MAP).map(([key, value]) => ({
      key: key as AccentKey,
      value,
    }));
  }, []);
  
  // Memoize the keys array
  const keys = useMemo(() => {
    return Object.keys(ACCENT_COLOR_MAP) as AccentKey[];
  }, []);
  
  return {
    current: currentColor,
    currentKey: accentKey,
    get: getAccentColor,
    colors,
    keys,
  };
}

export default useAccentColor;
