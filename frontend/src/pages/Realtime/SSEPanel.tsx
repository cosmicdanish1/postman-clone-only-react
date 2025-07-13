// File: SSEPanel.tsx
// Type: Component (panel for Server-Sent Events protocol)
// Imports: React
// Imported by: Realtime.tsx or protocol tab bar
// Role: Renders the UI for interacting with SSE protocol in the Realtime feature.
// Located at: src/pages/Realtime/SSEPanel.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const SSEPanel: React.FC = () => {
  const [url, setUrl] = useState('https://express-eventsource.herokuapp.com/events');
  const [eventType, setEventType] = useState('data');

  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  return (
    <div className={`flex flex-col flex-1 bg-bg rounded p-4 mt-2 text-text ${themeClass}`}>
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
          placeholder="https://express-eventsource.herokuapp.com/events"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <span className="text-gray-400 text-base ml-2">Event type</span>
        <input
          className="w-32 bg-bg border border-border rounded px-2 py-2 text-text focus:outline-none text-center font-mono"
          value={eventType}
          onChange={e => setEventType(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold ml-4">Start</button>
      </div>
      {/* The rest of the area is empty and dark */}
      <div className="flex-1 bg-bg" />
    </div>
  );
};

export default SSEPanel; 