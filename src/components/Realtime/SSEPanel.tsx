import React, { useState } from 'react';

const SSEPanel: React.FC = () => {
  const [url, setUrl] = useState('https://express-eventsource.herokuapp.com/events');
  const [eventType, setEventType] = useState('data');

  return (
    <div className="flex flex-col flex-1 bg-neutral-900 rounded p-4 mt-2">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 bg-[#18181b] border-none rounded px-4 py-2 text-white focus:outline-none"
          placeholder="https://express-eventsource.herokuapp.com/events"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <span className="text-gray-400 text-base ml-2">Event type</span>
        <input
          className="w-32 bg-[#18181b] border-none rounded px-2 py-2 text-white focus:outline-none text-center font-mono"
          value={eventType}
          onChange={e => setEventType(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold ml-4">Start</button>
      </div>
      {/* The rest of the area is empty and dark */}
      <div className="flex-1" />
    </div>
  );
};

export default SSEPanel; 