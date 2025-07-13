// File: MQTTPanel.tsx
// Type: Component (panel for MQTT protocol)
// Imports: React
// Imported by: Realtime.tsx or protocol tab bar
// Role: Renders the UI for interacting with MQTT protocol in the Realtime feature.
// Located at: src/pages/Realtime/MQTTPanel.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const MQTTPanel: React.FC = () => {
  const [url, setUrl] = useState('wss://test.mosquitto.org:8081');
  const [clientId, setClientId] = useState('hoppscotch');
  const [cleanSession, setCleanSession] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lastWillTopic, setLastWillTopic] = useState('');
  const [lastWillMessage, setLastWillMessage] = useState('');
  const [keepAlive, setKeepAlive] = useState(60);
  const [lastWillQos, setLastWillQos] = useState(0);
  const [lastWillRetain, setLastWillRetain] = useState(false);

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
        <input
          className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none font-semibold"
          placeholder={t('mqtt_url_placeholder')}
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <span className="text-gray-400 text-base font-semibold">{t('client_id')}</span>
        <input
          className="w-48 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none font-semibold"
          placeholder={t('client_id')}
          value={clientId}
          onChange={e => setClientId(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold ml-4">{t('connect')}</button>
      </div>
      {/* Connection Config Row */}
      <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
        <span className="text-gray-300 font-semibold text-base">{t('connection_config')}</span>
        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="accent-blue-600 w-5 h-5"
            checked={cleanSession}
            onChange={e => setCleanSession(e.target.checked)}
          />
          <span className="text-gray-400 font-semibold">{t('clean_session')}</span>
        </label>
      </div>
      {/* Table-like Config Grid */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
        {/* Row 1 */}
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-text border-none px-0 py-0 focus:outline-none"
            placeholder={t('username')}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-text border-none px-0 py-0 focus:outline-none"
            placeholder={t('last_will_topic')}
            value={lastWillTopic}
            onChange={e => setLastWillTopic(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10"></div>
        <div className="flex items-center h-10"></div>
        {/* Row 2 */}
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-text border-none px-0 py-0 focus:outline-none"
            placeholder={t('password')}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-text border-none px-0 py-0 focus:outline-none"
            placeholder={t('last_will_message')}
            value={lastWillMessage}
            onChange={e => setLastWillMessage(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10"></div>
        <div className="flex items-center h-10"></div>
        {/* Row 3 */}
        <div className="flex items-center h-10">
          <label className="flex items-center gap-2 w-full">
            <span className="text-gray-400">{t('keep_alive')}</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-20 bg-bg text-text font-bold border border-border px-2 py-1 focus:outline-none text-right appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={keepAlive}
              onChange={e => setKeepAlive(Number(e.target.value))}
              onWheel={e => e.currentTarget.blur()}
            />
          </label>
        </div>
        <div className="flex items-center h-10">
          <span className="text-gray-400 mr-2">{t('last_will_qos')}</span>
          <select
            className="bg-bg border border-border rounded px-2 py-1 text-text"
            value={lastWillQos}
            onChange={e => setLastWillQos(Number(e.target.value))}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <div className="flex items-center h-10"></div>
        <div className="flex items-center h-10">
          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="accent-blue-600 w-5 h-5"
              checked={lastWillRetain}
              onChange={e => setLastWillRetain(e.target.checked)}
            />
            <span className="text-gray-400 font-semibold">{t('last_will_retain')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MQTTPanel; 