import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import useThemeClass from '../../../hooks/useThemeClass';

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
        className={`h-2 relative transition-colors cursor-row-resize flex items-center justify-center z-10 ${borderClass}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-1 rounded-full bg-border group-hover:bg-accent transition-colors" />
        </div>
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
