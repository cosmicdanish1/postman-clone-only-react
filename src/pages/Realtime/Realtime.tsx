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
import { useSelector } from 'react-redux';

const MIN_LEFT_WIDTH = 300;
const MAX_LEFT_WIDTH = 900;

const PROTOCOLS = [
  { key: 'websocket', label: 'WebSocket', icon: 'wifi' },
  { key: 'sse', label: 'SSE', icon: 'rss_feed' },
  { key: 'socketio', label: 'Socket.IO', icon: 'settings_input_antenna' },
  { key: 'mqtt', label: 'MQTT', icon: 'router' },
];

const Realtime: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(700);
  const [dragging, setDragging] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('websocket');
  const dividerRef = useRef<HTMLDivElement>(null);

  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  const handleMouseDown = (e: React.MouseEvent) => {
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
      {/* Protocol tab bar at the top */}
      <RealtimeProtocolTabBar selectedProtocol={selectedProtocol} onSelectProtocol={setSelectedProtocol} />
      {/* Main area: protocol panel and help panel side by side */}
      <div className="flex flex-1 min-h-0 w-full">
        {/* Left: Protocol panel (resizable width) */}
        <div style={{ width: leftWidth }} className="flex flex-col h-full min-w-[300px] max-w-[900px] bg-bg">
          {renderProtocolUI()}
        </div>
        {/* Vertical divider for resizing */}
        <div
          ref={dividerRef}
          className="w-2 h-full cursor-col-resize bg-border hover:bg-blue-600 transition"
          onMouseDown={handleMouseDown}
          style={{ zIndex: 10 }}
        />
        {/* Right: Help panel */}
        <div className="flex-1 h-full bg-bg">
          <RealtimeHelpPanel />
        </div>
      </div>
    </div>
  );
};

export default Realtime; 