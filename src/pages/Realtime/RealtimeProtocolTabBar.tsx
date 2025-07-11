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



   const accentColor = useSelector((state: any) => state.theme.accentColor);
  
  // Optional: Get the hex color value

    const accentColors = [
    { key: 'green', color: '#22c55e' },
    { key: 'blue', color: '#2563eb' },
    { key: 'cyan', color: '#06b6d4' },
    { key: 'purple', color: '#7c3aed' },
    { key: 'yellow', color: '#eab308' },
    { key: 'orange', color: '#f59e42' },
    { key: 'red', color: '#ef4444' },
    { key: 'pink', color: '#ec4899' },
  ];


  
  const accentHex = accentColors.find(c => c.key === accentColor)?.color;
  // No class for light (default)
  return (
    <div className={`flex items-center gap-0  border-border bg-bg h-12 ${themeClass}`}>
      {PROTOCOLS.map(protocol => (
        <button
          key={protocol.key}
          onClick={() => onSelectProtocol(protocol.key)}
          className={`px-6 h-full font-semibold text-base border-b-2  transition-colors duration-150 ${selectedProtocol === protocol.key ? ' text-text bg-bg' : 'border-transparent text-gray-400 hover:text-text hover:bg-bg/80'}`}
          style={{ outline: 'none' , borderColor: selectedProtocol === protocol.key ? accentHex : 'transparent' }}
        >
          {protocol.label}
        </button>
      ))}
    </div>
  );
};

export default RealtimeProtocolTabBar; 