import React, { useRef, useState } from 'react';

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
  const dragType = useRef<'top' | 'bottom' | null>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const [dragging, setDragging] = useState<'top' | 'bottom' | null>(null);
  const [hovered, setHovered] = useState<'top' | 'bottom' | null>(null);

  const onMouseDown = (e: React.MouseEvent, type: 'top' | 'bottom') => {
    dragType.current = type;
    setDragging(type);
    startY.current = e.clientY;
    startHeight.current = height;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragType.current) return;
    let newHeight = startHeight.current;
    if (dragType.current === 'top') {
      newHeight -= e.clientY - startY.current;
    } else {
      newHeight += e.clientY - startY.current;
    }
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    setHeight(newHeight);
  };

  const onMouseUp = () => {
    dragType.current = null;
    setDragging(null);
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none', // allow clicks to pass through except panel
      }}
    >
      <div
        style={{
          width: '100%',
          borderTop: '1px solid #e5e7eb', // Tailwind gray-200
          marginBottom: -1,
        }}
      />
      {/* Top drag handle - now outside the panel */}
      {height > minHeight && (
        <div
          style={{
            height: 16,
            width: '100%',
            cursor: 'ns-resize',
            position: 'relative',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
          onMouseDown={e => onMouseDown(e, 'top')}
          onMouseEnter={() => setHovered('top')}
          onMouseLeave={() => setHovered(null)}
        >
          {(hovered === 'top' || dragging === 'top') && (
            <div style={{
              width: '100%',
              height: 3,
              background: dragging === 'top' ? '#3b82f6' : '#d1d5db',
              borderRadius: 2,
              marginTop: 6
            }} />
          )}
        </div>
      )}
      {/* Panel */}
      <div
        ref={panelRef}
        className="bg-neutral-900 dark:bg-gray-900"
        style={{
          width: '100%',
          height,
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
          margin: '0 auto',
          position: 'relative',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
      {/* Bottom drag handle - now outside the panel */}
      {height < maxHeight && (
        <div
          style={{
            height: 16,
            width: '100%',
            cursor: 'ns-resize',
            position: 'relative',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
          onMouseDown={e => onMouseDown(e, 'bottom')}
          onMouseEnter={() => setHovered('bottom')}
          onMouseLeave={() => setHovered(null)}
        >
          {(hovered === 'bottom' || dragging === 'bottom') && (
            <div style={{
              width: '100%',
              height: 3,
              background: dragging === 'bottom' ? '#3b82f6' : '#d1d5db',
              borderRadius: 2,
              marginBottom: 6
            }} />
          )}
        </div>
      )}
    </div>
  );
};

export default ResizableBottomPanel; 