import React from 'react';
import { useDragResize } from '../../../hooks/useDragResize';

interface RestSplitPaneProps {
  /** Main editor area (left) */
  children: React.ReactNode;
  /** Side panel contents (right) */
  right: React.ReactNode;
}

const MIN_RIGHT_WIDTH = 260;
const MAX_RIGHT_WIDTH = 500;
const DEFAULT_RIGHT_WIDTH = 340;

const RestSplitPane: React.FC<RestSplitPaneProps> = ({ children, right }) => {
  const { size: rightWidth, dividerRef } = useDragResize({
    initial: DEFAULT_RIGHT_WIDTH,
    min: MIN_RIGHT_WIDTH,
    max: MAX_RIGHT_WIDTH,
    direction: 'horizontal',
  });

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Main (left) */}
      <div className="flex-1 min-w-0 overflow-auto">
        {children}
      </div>

      {/* Divider (hidden on small screens) */}
      <div
        ref={dividerRef}
        className="w-2 h-full cursor-col-resize bg-border hover:bg-blue-600 transition hidden sm:block"
        style={{ zIndex: 10 }}
      />

      {/* Right panel (hidden on small screens) */}
      <div
        className="flex-none hidden sm:block"
        style={{ width: rightWidth, minWidth: MIN_RIGHT_WIDTH, maxWidth: MAX_RIGHT_WIDTH, overflow: 'hidden' }}
      >
        {right}
      </div>
    </div>
  );
};

export default RestSplitPane;
