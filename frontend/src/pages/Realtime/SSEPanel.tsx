// File: SSEPanel.tsx
// Type: Component (panel for Server-Sent Events protocol)
// Imports: React
// Imported by: Realtime.tsx or protocol tab bar
// Role: Renders the UI for interacting with SSE protocol in the Realtime feature.
// Located at: src/pages/Realtime/SSEPanel.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';

const SSEPanel: React.FC = () => {
  const { t } = useTranslation();
  const { themeClass, accentColorClass } = useThemeClass();
  
  const [url, setUrl] = useState('https://express-eventsource.herokuapp.com/events');
  const [eventType, setEventType] = useState('data');
  
  // Set default event type from translations after component mounts
  React.useEffect(() => {
    setEventType(t('realtime.sse.default_event_type'));
  }, [t]);

  return (
    <div className={`flex flex-col flex-1 bg-bg rounded p-4 mt-2 text-text ${themeClass}`}>
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
          placeholder={t('realtime.sse.url_placeholder')}
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <span className="text-gray-400 text-base ml-2">{t('realtime.sse.event_type')}</span>
        <input
          className="w-32 bg-bg border border-border rounded px-2 py-2 text-text focus:outline-none text-center font-mono"
          value={eventType}
          onChange={e => setEventType(e.target.value)}
        />
        <button 
          className={`px-8 py-2 rounded font-semibold text-white ${accentColorClass.bg} ${accentColorClass.hover} transition-colors ml-4`}
        >
          {t('realtime.actions.start')}
        </button>
      </div>
      {/* The rest of the area is empty and dark */}
      <div className="flex-1 bg-bg" />
    </div>
  );
};

export default SSEPanel; 