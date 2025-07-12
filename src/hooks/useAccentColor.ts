import { useSelector } from 'react-redux';
import type { RootState } from '../store';

/**
 * Central map of accent key -> hex. Import once, reuse everywhere.
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

/**
 * Returns the current accent color hex (e.g. "#22c55e") from Redux state.
 *
 * Usage:
 *   const accentHex = useAccentColor();
 */
export default function useAccentColor(): string {
  const accentKey = useSelector((state: RootState) => state.theme.accentColor) as AccentKey;
  return ACCENT_COLOR_MAP[accentKey];
}
