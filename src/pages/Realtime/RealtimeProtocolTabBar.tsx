// File: RealtimeProtocolTabBar.tsx
// Type: Component (tab bar for real-time protocols)
// Imports: React
// Imported by: Realtime.tsx
// Role: Renders the tab bar for switching between real-time protocols (WebSocket, SSE, etc.).
// Located at: src/pages/Realtime/RealtimeProtocolTabBar.tsx
import React from 'react';

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

const RealtimeProtocolTabBar: React.FC<RealtimeProtocolTabBarProps> = ({ selectedProtocol, onSelectProtocol }) => (
  <div className="flex items-center gap-0 border-b border-neutral-800 bg-[#18181A] h-12">
    {PROTOCOLS.map(protocol => (
      <button
        key={protocol.key}
        onClick={() => onSelectProtocol(protocol.key)}
        className={`px-6 h-full font-semibold text-base border-b-2 transition-colors
          ${selectedProtocol === protocol.key ? 'border-blue-500 text-white bg-[#232329]' : 'border-transparent text-gray-400 hover:text-white hover:bg-[#232329]'}`}
        style={{ outline: 'none' }}
      >
        {protocol.label}
      </button>
    ))}
  </div>
);

export default RealtimeProtocolTabBar; 