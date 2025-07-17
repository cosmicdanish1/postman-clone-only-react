import React, { useState, useRef } from 'react';
import useThemeClass from '../../hooks/useThemeClass';

const icons = [
  // Book (active)
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  ),
  // Cube
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  // Folder
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 3h6a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // Clock
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
];

const panelContents = [
  <div className="text-gray-400 text-center mt-8">GraphQL Schema Panel</div>,
  <div className="text-gray-400 text-center mt-8">GraphQL Explorer Panel</div>,
  <div className="text-gray-400 text-center mt-8">GraphQL Collections Panel</div>,
  <div className="text-gray-400 text-center mt-8">GraphQL History Panel</div>,
];

const MIN_WIDTH = 260;
const DEFAULT_WIDTH = 340;
const MAX_WIDTH = 500; // Limited maximum width

const GraphQLRightPanel: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const [hovered, setHovered] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  // Use theme class hook for consistent theming
  const { themeClass, accentColor, borderClass } = useThemeClass();
  
  // Use the accent color directly from the theme

  const onMouseDown = (e: React.MouseEvent, edge: 'left' | 'right') => {
    setDragging(edge);
    startX.current = e.clientX;
    startWidth.current = width;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    let newWidth = startWidth.current;
    if (dragging === 'left') {
      newWidth = startWidth.current - (e.clientX - startX.current);
    } else if (dragging === 'right') {
      newWidth = startWidth.current + (e.clientX - startX.current);
    }
    // Limited drag range - only allow small adjustments
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setWidth(newWidth);
  };

  const onMouseUp = () => {
    setDragging(null);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className={`flex flex-row h-full w-full bg-bg text-text ${themeClass}`}
      style={{ 
        width: width, 
        minWidth: MIN_WIDTH, 
        maxWidth: MAX_WIDTH, 
        transition: dragging ? 'none' : 'width 0.15s', 
        position: 'relative' 
      }}
    >
      {/* Thin left drag handle */}
      <div
        style={{ 
          width: 4, // Much thinner drag handle
          height: '100%', 
          cursor: 'ew-resize', 
          background: dragging === 'left' ? accentColor : 'transparent', 
          zIndex: 41, 
          position: 'absolute', 
          left: 0, 
          top: 0,
          transition: 'background 0.15s ease'
        }}
        onMouseDown={e => onMouseDown(e, 'left')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Resize panel"
      >
        {/* Thin accent line on hover/drag */}
        {(hovered || dragging) && (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: accentColor,
              opacity: dragging ? 1 : 0.6,
              transition: 'opacity 0.15s ease'
            }}
          />
        )}
      </div>

      {/* Sub sidebar */}
      <div className="flex flex-col items-center py-4 px-0 gap-6 bg-bg-secondary h-full w-14">
        {icons.map((icon, idx) => (
          <button
            key={idx}
            className={`flex items-center justify-center w-10 h-10 rounded-lg mb-1 transition-colors duration-150
              ${activeIdx === idx 
                ? `bg-accent/20 text-accent` 
                : 'text-text/60 hover:bg-bg-secondary hover:text-accent'
              } cursor-pointer`}
            onClick={() => setActiveIdx(idx)}
            aria-label={`Panel ${idx + 1}`}
            type="button"
          >
            {icon}
          </button>
        ))}
      </div>
      {/* Main right panel content area, changes with activeIdx */}
      <div className={`flex-1 p-4 overflow-y-auto bg-bg ${borderClass}`}>
        {panelContents[activeIdx]}
      </div>
    </div>
  );
};

export default GraphQLRightPanel; 