import React, { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface ResizableRightPanelProps {
  /** Panel content */
  children: React.ReactNode;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Default width in pixels */
  defaultWidth?: number;
  /** Callback when panel is resized */
  onResize?: (width: number) => void;
  /** Additional class names */
  className?: string;
}

const ResizableRightPanel: React.FC<ResizableRightPanelProps> = ({
  children,
  minWidth = 300,
  defaultWidth = 380,
  onResize,
  className = '',
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Update width when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (width > window.innerWidth * 0.8) {
        const newWidth = Math.max(minWidth, window.innerWidth * 0.6);
        setWidth(newWidth);
        onResize?.(newWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, minWidth, onResize]);

  const handleResize = (_: any, { size }: { size: { width: number } }) => {
    const newWidth = Math.max(minWidth, size.width);
    setWidth(newWidth);
    onResize?.(newWidth);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeStop = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  return (
    <div
      className={`fixed right-0 top-0 bottom-0 z-20 ${isResizing ? 'select-none' : ''} ${className}`}
      style={{
        width: `${width}px`,
        transition: isResizing ? 'none' : 'width 0.2s ease',
        boxShadow: isHovering ? '-2px 0 12px rgba(0,0,0,0.1)' : 'none',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => !isResizing && setIsHovering(false)}
    >
      <Resizable
        width={width}
        height={0} // Height is managed by parent
        minConstraints={[minWidth, 0]}
        maxConstraints={[window.innerWidth * 0.8, 0]}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        resizeHandles={['w']} // Only left handle
        handle={
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-transparent hover:bg-blue-300 active:bg-blue-400 transition-colors cursor-col-resize" />
        }
      >
        <div className="h-full w-full overflow-auto bg-white dark:bg-gray-800">
          {children}
        </div>
      </Resizable>
    </div>
  );
};

export default ResizableRightPanel;
