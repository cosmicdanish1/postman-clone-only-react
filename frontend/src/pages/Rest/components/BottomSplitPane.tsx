import type { CSSProperties } from 'react';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import useThemeClass from '../../../hooks/useThemeClass';
import useAccentColor from '../../../hooks/useAccentColor';

interface BottomSplitPaneProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
  defaultBottomSize?: number; // percent
  minBottomSize?: number; // percent
  maxBottomSize?: number; // percent
}

const BottomSplitPane: React.FC<BottomSplitPaneProps> = ({
  top,
  bottom,
  defaultBottomSize = 30,
  minBottomSize = 10,
  maxBottomSize = 50,
}) => {
  const { borderClass, themeClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  return (
    <PanelGroup direction="vertical" className={`flex-1 flex ${themeClass}`}>
      {/* Top panel (main content) */}
      <Panel
        defaultSize={100 - defaultBottomSize}
        minSize={30}
        className="min-h-0 overflow-auto"
      >
        {top}
      </Panel>

      {/* Resize handle */}
      <PanelResizeHandle
        id="resize-bottom-handle"
        className={`h-4 relative cursor-row-resize flex items-center justify-center z-10 group`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`w-16 h-1 rounded-full transition-all duration-200 ${borderClass} group-hover:h-1.5 group-hover:bg-opacity-100`}
            style={{
              '--accent-color': accentColor,
            } as CSSProperties}
          />
        </div>
        <style>
          {`
            #resize-bottom-handle:hover > div > div {
              background-color: var(--accent-color) !important;
              height: 3px !important;
              transform: scaleY(1.5);
            }
            #resize-bottom-handle > div > div {
              background-color: ${borderClass.includes('border-gray-200') ? '#e5e7eb' : '#374151'};
              opacity: 0.7;
            }
          `}
        </style>
      </PanelResizeHandle>

      {/* Bottom panel */}
      <Panel
        defaultSize={defaultBottomSize}
        minSize={minBottomSize}
        maxSize={maxBottomSize}
        className="min-h-[100px] max-h-[50vh] overflow-auto"
      >
        {bottom}
      </Panel>
    </PanelGroup>
  );
};

export default BottomSplitPane;
