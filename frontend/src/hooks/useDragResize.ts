import { useEffect, useRef, useState } from 'react';

/**
 * Generic hook to make a divider draggable for resizing a target panel.
 * Currently supports horizontal drag (left⇄right) where the divider moves
 * along the X-axis and you want to update the *right* panel width.
 *
 * Usage:
 * const { size: rightWidth, dividerRef } = useDragResize({
 *   initial: 340,
 *   min: 260,
 *   max: 500,
 *   direction: 'horizontal',
 * });
 *
 * <div ref={dividerRef} />
 */
export interface UseDragResizeOptions {
  /** Starting size (px) */
  initial: number;
  /** Minimum allowed size (px) */
  min: number;
  /** Maximum allowed size (px) */
  max: number;
  /** Drag axis – only `horizontal` supported for now */
  direction: 'horizontal';
}

export interface UseDragResizeReturn {
  /** Current panel size (px) controlled by the divider */
  size: number;
  /** Attach to the draggable divider element */
  dividerRef: React.RefObject<HTMLDivElement>;
}

export const useDragResize = (
  {
    initial,
    min,
    max,
    direction,
  }: UseDragResizeOptions,
): UseDragResizeReturn => {
  const [size, setSize] = useState(initial);
  const dividerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (direction !== 'horizontal') return; // future-proof guard

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const container = dividerRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      // Measure size of RIGHT panel (distance between mouse and container right)
      let newSize = rect.right - e.clientX;
      if (newSize < min) newSize = min;
      if (newSize > max) newSize = max;
      setSize(newSize);
    };

    const handleMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [direction, min, max]);

  useEffect(() => {
    const dividerEl = dividerRef.current;
    if (!dividerEl) return;

    const handleMouseDown = () => {
      draggingRef.current = true;
      document.body.style.cursor = 'col-resize';
    };

    dividerEl.addEventListener('mousedown', handleMouseDown);
    return () => dividerEl.removeEventListener('mousedown', handleMouseDown);
  }, []);

  return { size, dividerRef };
};
