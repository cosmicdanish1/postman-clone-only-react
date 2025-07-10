import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getThemeStyles } from '../utils/getThemeStyles';

interface ResizableBottomPanelProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
}

const ResizableBottomPanel: React.FC<ResizableBottomPanelProps> = ({
  children,
  minHeight = 120,
  maxHeight = 400,
  defaultHeight = 220,
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  // 🟡 Theme and Accent Color Setup
  const theme = useSelector((state: any) => state.theme.theme);
  const accentColor = useSelector((state: any) => state.theme.accentColor);

  const accentColors = [
    { key: 'green', color: '#22c55e' },
    { key: 'blue', color: '#2563eb' },
    { key: 'cyan', color: '#06b6d4' },
    { key: 'purple', color: '#7c3aed' },
    { key: 'yellow', color: '#eab308' },
    { key: 'orange', color: '#f59e42' },
    { key: 'red', color: '#ef4444' },
    { key: 'pink', color: '#ec4899' },
  ];

  const accentHex = accentColors.find(c => c.key === accentColor)?.color;

  // 🟡 Dynamic classes based on theme
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

  let borderClass = 'border-neutral-700';
  let bgClass = 'bg-neutral-900';
  let dragHandleBg = 'rgba(136, 136, 136, 0.25)';

  if (theme === 'black') {
    borderClass = 'border-neutral-800';
    bgClass = 'bg-black';
    dragHandleBg = 'rgba(136, 136, 136, 0.15)';
  } else if (theme === 'light') {
    borderClass = 'border-gray-200';
    bgClass = 'bg-gray-100';
    dragHandleBg = 'rgba(136, 136, 136, 0.1)';
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startY.current = e.clientY;
    startHeight.current = height;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight.current - (e.clientY - startY.current)));
    setHeight(newHeight);
  };

  const onMouseUp = () => {
    setDragging(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Optional top border */}
      <div className={`border-t ${borderClass}`} style={{ width: '100%', marginBottom: -1 }} />

      {/* Top drag handle */}
      <div
        style={{
          height: 16,
          width: '100%',
          cursor: 'ns-resize',
          position: 'relative',
          zIndex: 3,
          pointerEvents: 'auto',
        }}
        onMouseDown={onMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered || dragging ? (
          <div
            className="w-full"
            style={{
              height: 2,
              background: dragging ? accentHex : accentHex,
              borderRadius: 2,
            }}
          />
        ) : null}
      </div>

      {/* Resizable Panel */}
      <div
        ref={panelRef}
        className={`${bgClass} ${themeClass}`}
        style={{
          width: '100%',
          height,
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResizableBottomPanel; 