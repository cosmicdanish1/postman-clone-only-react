// File: RealtimeProtocolTabBar.tsx
// Type: Component (tab bar for real-time protocols)
// Imports: React
// Imported by: Realtime.tsx
// Role: Renders the tab bar for switching between real-time protocols (WebSocket, SSE, etc.).
// Located at: src/pages/Realtime/RealtimeProtocolTabBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';

const PROTOCOLS = ['websocket', 'sse', 'socketio', 'mqtt'];

interface RealtimeProtocolTabBarProps {
  selectedProtocol: string;
  onSelectProtocol: (protocol: string) => void;
}

const RealtimeProtocolTabBar: React.FC<RealtimeProtocolTabBarProps> = ({ selectedProtocol, onSelectProtocol }) => {
  const { t } = useTranslation();
  const { themeClass, accentColor } = useThemeClass();

  return (
    <div className={`flex items-center gap-0 border-border bg-bg h-12 ${themeClass}`}>
      {PROTOCOLS.map(protocol => {
        const isSelected = selectedProtocol === protocol;
        return (
          <button
            key={protocol}
            onClick={() => onSelectProtocol(protocol)}
            className={`px-6 h-full font-semibold text-base border-b-2 transition-colors duration-150 ${
              isSelected 
                ? 'text-text bg-bg' 
                : 'border-transparent text-gray-400 hover:text-text hover:bg-bg/80'
            }`}
            style={{ 
              outline: 'none', 
              borderColor: isSelected ? accentColor : 'transparent',
              color: isSelected ? accentColor : undefined
            }}
          >
            {t(`realtime.protocols.${protocol}`)}
          </button>
        );
      })}
    </div>
  );
};

export default RealtimeProtocolTabBar;