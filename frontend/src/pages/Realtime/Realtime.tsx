// File: Realtime.tsx
// Type: Page (Realtime feature entry)
// Imports: React, various protocol panels and tabs
// Imported by: App.tsx (via route)
// Role: Main entry point for the Realtime feature, renders the UI for real-time protocols (WebSocket, MQTT, SSE, etc.).
// Located at: src/pages/Realtime/Realtime.tsx
import React, { useRef, useState } from 'react';
import RealtimeProtocolTabBar from './RealtimeProtocolTabBar';
import WebSocketPanel from './WebSocketPanel';
import SSEPanel from './SSEPanel';
import SocketIOPanel from './SocketIOPanel';
import MQTTPanel from './MQTTPanel';
import RealtimeHelpPanel from './RealtimeHelpPanel';
import useThemeClass from '../../hooks/useThemeClass';

const MIN_LEFT_WIDTH = 300;
const MAX_LEFT_WIDTH = 900;

const Realtime: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(700);
  const [dragging, setDragging] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('websocket');
  const dividerRef = useRef<HTMLDivElement>(null);

  const { themeClass, accentColor } = useThemeClass();

  const handleMouseDown = (_e: React.MouseEvent) => {
    setDragging(true);
    document.body.style.cursor = 'col-resize';
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const container = dividerRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let newWidth = e.clientX - rect.left;
      if (newWidth < MIN_LEFT_WIDTH) newWidth = MIN_LEFT_WIDTH;
      if (newWidth > MAX_LEFT_WIDTH) newWidth = MAX_LEFT_WIDTH;
      setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Placeholder UIs for each protocol
  const renderProtocolUI = () => {
    switch (selectedProtocol) {
      case 'websocket':
        return <WebSocketPanel />;
      case 'sse':
        return <SSEPanel />;
      case 'socketio':
        return <SocketIOPanel />;
      case 'mqtt':
        return <MQTTPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-full w-full bg-bg text-text ${themeClass}`}>
      {/* Protocol tab bar at the top (make scrollable on mobile) */}
      <div className="overflow-x-auto whitespace-nowrap">
        <RealtimeProtocolTabBar selectedProtocol={selectedProtocol} onSelectProtocol={setSelectedProtocol} />
      </div>
      {/* Main area: protocol panel and help panel side by side on desktop, stacked on mobile */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 w-full">
        {/* Left: Protocol panel (resizable width on sm+, full width on mobile) */}
        <div style={{ width: leftWidth }} className="flex flex-col h-full min-w-[300px] max-w-[900px] bg-bg w-full sm:w-auto">
          {renderProtocolUI()}
        </div>
        {/* Vertical divider for resizing (hide on mobile) */}
        <div
          ref={dividerRef}
          className="w-2 h-full cursor-col-resize bg-border transition hidden sm:block hover:opacity-100"
          style={{
            zIndex: 10,
            backgroundColor: dragging ? accentColor : 'var(--border)',
            opacity: dragging ? 1 : 0.5
          }}
          onMouseDown={handleMouseDown}
        />
        {/* Right: Help panel (hide on mobile) */}
        <div className="flex-1 h-full bg-bg hidden sm:block">
          <RealtimeHelpPanel />
        </div>
      </div>
    </div>
  );
};

export default Realtime; 