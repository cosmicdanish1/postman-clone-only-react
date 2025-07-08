// File: RealtimeProtocolTabBar.tsx
// Type: Component (tab bar for real-time protocols)
// Imports: React
// Imported by: Realtime.tsx
// Role: Renders the tab bar for switching between real-time protocols (WebSocket, SSE, etc.).
// Located at: src/pages/Realtime/RealtimeProtocolTabBar.tsx
import React from 'react';
import { useSelector } from 'react-redux';

const PROTOCOLS = [
  { key: 'websocket', label: 'WebSocket' },
  { key: 'sse', label: 'SSE' },
  { key: 'socketio', label: 'Socket.IO' },
  { key: 'mqtt', label: 'MQTT' },
];

interface RealtimeProtocolTabBarProps {
  selectedProtocol: string;
  onSelectProtocol: (protocol: string) => void;
}

const RealtimeProtocolTabBar: React.FC<RealtimeProtocolTabBarProps> = ({ selectedProtocol, onSelectProtocol }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`flex items-center gap-0 border-b border-border bg-bg h-12 ${themeClass}`}>
      {PROTOCOLS.map(protocol => (
        <button
          key={protocol.key}
          onClick={() => onSelectProtocol(protocol.key)}
          className={`px-6 h-full font-semibold text-base border-b-2 transition-colors duration-150 ${selectedProtocol === protocol.key ? 'border-blue-500 text-text bg-bg' : 'border-transparent text-gray-400 hover:text-text hover:bg-bg/80'}`}
          style={{ outline: 'none' }}
        >
          {protocol.label}
        </button>
      ))}
    </div>
  );
};

export default RealtimeProtocolTabBar; 