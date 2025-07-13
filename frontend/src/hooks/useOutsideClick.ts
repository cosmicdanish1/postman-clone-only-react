import { useEffect } from 'react';

/**
 * Reusable hook that listens for clicks outside a referenced element and
 * calls the provided callback when the `active` flag is true.
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T>,
  active: boolean,
  onOutside: () => void,
) {
  useEffect(() => {
    if (!active) return;

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [active, onOutside, ref]);
}
