// File: SocketIOPanel.tsx
// Type: Component (panel for Socket.IO protocol)
// Imports: React
// Imported by: Realtime.tsx or protocol tab bar
// Role: Renders the UI for interacting with Socket.IO protocol in the Realtime feature.
// Located at: src/pages/Realtime/SocketIOPanel.tsx
import React, { useState } from 'react';
import CommunicationTab from './CommunicationTab';
import { FiRss } from 'react-icons/fi';
import AuthorizationTabContent from '../../components/TabContentArea/AuthorizationTabContent';

const SocketIOPanel: React.FC = () => {
  const [clientVersion, setClientVersion] = useState('v2');
  const [url, setUrl] = useState('wss://echo-socketio.hoppscotch.io');
  const [namespace, setNamespace] = useState('/socket.io');
  const [activeTab, setActiveTab] = useState<'communication' | 'authorization'>('communication');
  const [message, setMessage] = useState('');
  const [eventName, setEventName] = useState('');

  return (
    <div className="flex flex-col flex-1 bg-neutral-900 rounded p-4 mt-2">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <select
          className="bg-[#18181b] border-none rounded px-4 py-2 text-white font-semibold"
          value={clientVersion}
          onChange={e => setClientVersion(e.target.value)}
        >
          <option value="v2">Client v2</option>
          <option value="v3">Client v3</option>
          <option value="v4">Client v4</option>
        </select>
        <input
          className="flex-1 bg-[#18181b] border-none rounded px-4 py-2 text-white focus:outline-none"
          placeholder="wss://echo-socketio.hoppscotch.io"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <input
          className="w-40 bg-[#18181b] border-none rounded px-4 py-2 text-white focus:outline-none"
          placeholder="/socket.io"
          value={namespace}
          onChange={e => setNamespace(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold ml-4">Connect</button>
      </div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-800 mb-2">
        <button
          className={`px-2 py-1 border-b-2 font-semibold transition-colors ${activeTab === 'communication' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('communication')}
        >
          Communication
        </button>
        <button
          className={`px-2 py-1 border-b-2 font-semibold transition-colors ${activeTab === 'authorization' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('authorization')}
        >
          Authorization
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'communication' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <FiRss className="text-blue-400 text-xl ml-1" />
            <input
              className="flex-1 bg-[#18181b] border-none rounded px-4 py-2 text-gray-400 focus:outline-none"
              placeholder="Event/Topic Name"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
            />
          </div>
          <CommunicationTab message={message} setMessage={setMessage} />
        </>
      ) : (
        <AuthorizationTabContent />
      )}
    </div>
  );
};

export default SocketIOPanel; 