import React, { useRef, useState } from 'react';
import RealtimeProtocolTabBar from '../components/Realtime/RealtimeProtocolTabBar';
import WebSocketPanel from '../components/Realtime/WebSocketPanel';
import SSEPanel from '../components/Realtime/SSEPanel';
import SocketIOPanel from '../components/Realtime/SocketIOPanel';
import MQTTPanel from '../components/Realtime/MQTTPanel';
import RealtimeHelpPanel from '../components/Realtime/RealtimeHelpPanel';

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
    <div className="flex flex-col h-full w-full bg-[#18181b] text-white">
      {/* Protocol tab bar at the top */}
      <RealtimeProtocolTabBar selectedProtocol={selectedProtocol} onSelectProtocol={setSelectedProtocol} />
      {/* Main area: protocol panel and help panel side by side */}
      <div className="flex flex-1 min-h-0 w-full">
        {/* Left: Protocol panel (resizable width) */}
        <div style={{ width: leftWidth }} className="flex flex-col h-full min-w-[300px] max-w-[900px] bg-[#18181b]">
          {renderProtocolUI()}
        </div>
        {/* Vertical divider for resizing */}
        <div
          ref={dividerRef}
          className="w-2 h-full cursor-col-resize bg-[#232329] hover:bg-blue-600 transition"
          onMouseDown={handleMouseDown}
          style={{ zIndex: 10 }}
        />
        {/* Right: Help panel */}
        <div className="flex-1 h-full bg-[#18181b]">
          <RealtimeHelpPanel />
        </div>
      </div>
    </div>
  );
};

export default Realtime; 