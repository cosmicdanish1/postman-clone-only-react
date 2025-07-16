import React, { useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import useThemeClass from '../../../hooks/useThemeClass';
import useAccentColor from '../../../hooks/useAccentColor';

interface RestSplitPaneProps {
  /** Main editor area (left) */
  children: React.ReactNode;
  /** Side panel contents (right) */
  right: React.ReactNode;
}

const MIN_PANEL_WIDTH = 300;  // Minimum width in pixels (can't be resized smaller than this)
const DEFAULT_PANEL_WIDTH = 380; // Default width in pixels (initial size)

const RestSplitPane: React.FC<RestSplitPaneProps> = ({ children, right }) => {
  const { borderClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();
  
  // Calculate the default and min sizes in percentage based on viewport width
  const { defaultSize, minSize } = useMemo(() => {
    if (typeof window === 'undefined') return { defaultSize: 30, minSize: 20 };
    
    const viewportWidth = window.innerWidth;
    const calculatedDefault = Math.min(30, Math.max(20, (DEFAULT_PANEL_WIDTH / viewportWidth) * 100));
    const calculatedMin = (MIN_PANEL_WIDTH / viewportWidth) * 100;
    
    return {
      defaultSize: calculatedDefault,
      minSize: calculatedMin
    };
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <PanelGroup direction="horizontal" className="flex-1 flex">
        {/* Main content area */}
        <Panel 
          defaultSize={100 - defaultSize}
          minSize={50}
          className="min-w-0 overflow-auto"
        >
          {children}
        </Panel>

        {/* Resize handle */}
        <PanelResizeHandle 
          id="resize-handle"
          className={`
            w-1.5
            relative
            transition-colors 
            cursor-col-resize 
            flex items-center justify-center
            ${borderClass}
            z-10
            hidden sm:flex
          `}
          style={{
            backgroundColor: 'transparent',
            transition: 'background-color 150ms ease-in-out'
          }}
        >
          <div 
            className="w-1 h-12 transition-colors"
            style={{ 
              pointerEvents: 'none',
              backgroundColor: 'transparent',
              height: '70rem',
              transition: 'background-color 150ms ease-in-out'
            }}
          />
        </PanelResizeHandle>
        <style>{`
          #resize-handle:hover > div {
            background-color: ${accentColor} !important;
            opacity: 0.7;
          }
        `}</style>
        
        {/* Right panel */}
        <Panel 
          defaultSize={defaultSize}
          minSize={minSize}
          maxSize={50}
          className="h-full bg-bg hidden sm:block"
        >
          {right}
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default RestSplitPane;
