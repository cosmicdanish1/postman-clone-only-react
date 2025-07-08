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
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SocketIOPanel: React.FC = () => {
  const [clientVersion, setClientVersion] = useState('v2');
  const [url, setUrl] = useState('wss://echo-socketio.hoppscotch.io');
  const [namespace, setNamespace] = useState('/socket.io');
  const [activeTab, setActiveTab] = useState<'communication' | 'authorization'>('communication');
  const [message, setMessage] = useState('');
  const [eventName, setEventName] = useState('');

  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  return (
    <div className={`flex flex-col flex-1 bg-bg rounded p-4 mt-2 text-text ${themeClass}`}>
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <select
          className="bg-bg border border-border rounded px-4 py-2 text-text font-semibold"
          value={clientVersion}
          onChange={e => setClientVersion(e.target.value)}
        >
          <option value="v2">{t('client_v2')}</option>
          <option value="v3">{t('client_v3')}</option>
          <option value="v4">{t('client_v4')}</option>
        </select>
        <input
          className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
          placeholder={t('socketio_url_placeholder')}
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <input
          className="w-40 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
          placeholder={t('namespace_placeholder')}
          value={namespace}
          onChange={e => setNamespace(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold ml-4">{t('connect')}</button>
      </div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-2">
        <button
          className={`px-2 py-1 border-b-2 font-semibold transition-colors ${activeTab === 'communication' ? 'border-blue-500 text-text' : 'border-transparent text-gray-400 hover:text-text'}`}
          onClick={() => setActiveTab('communication')}
        >
          {t('communication')}
        </button>
        <button
          className={`px-2 py-1 border-b-2 font-semibold transition-colors ${activeTab === 'authorization' ? 'border-blue-500 text-text' : 'border-transparent text-gray-400 hover:text-text'}`}
          onClick={() => setActiveTab('authorization')}
        >
          {t('authorization')}
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'communication' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <FiRss className="text-blue-400 text-xl ml-1" />
            <input
              className="flex-1 bg-bg border border-border rounded px-4 py-2 text-gray-400 focus:outline-none"
              placeholder={t('event_topic_name')}
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