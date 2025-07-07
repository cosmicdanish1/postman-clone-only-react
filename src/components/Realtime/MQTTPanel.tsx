import React, { useState } from 'react';

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

  return (
    <div className="flex flex-col flex-1 bg-neutral-900 rounded p-4 mt-2">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 bg-[#18181b] border-none rounded px-4 py-2 text-white focus:outline-none font-semibold"
          placeholder="wss://test.mosquitto.org:8081"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ minWidth: 0 }}
        />
        <span className="text-gray-400 text-base font-semibold">Client ID</span>
        <input
          className="w-48 bg-[#18181b] border-none rounded px-4 py-2 text-white focus:outline-none font-semibold"
          placeholder="Client ID"
          value={clientId}
          onChange={e => setClientId(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold ml-4">Connect</button>
      </div>
      {/* Connection Config Row */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
        <span className="text-gray-300 font-semibold text-base">Connection Config</span>
        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="accent-blue-600 w-5 h-5"
            checked={cleanSession}
            onChange={e => setCleanSession(e.target.checked)}
          />
          <span className="text-gray-400 font-semibold">Clean Session</span>
        </label>
      </div>
      {/* Table-like Config Grid */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
        {/* Row 1 */}
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-gray-400 border-none px-0 py-0 focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-gray-400 border-none px-0 py-0 focus:outline-none"
            placeholder="Last-Will Topic"
            value={lastWillTopic}
            onChange={e => setLastWillTopic(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10"></div>
        <div className="flex items-center h-10"></div>
        {/* Row 2 */}
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-gray-400 border-none px-0 py-0 focus:outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10">
          <input
            className="w-full bg-transparent text-gray-400 border-none px-0 py-0 focus:outline-none"
            placeholder="Last-Will Message"
            value={lastWillMessage}
            onChange={e => setLastWillMessage(e.target.value)}
          />
        </div>
        <div className="flex items-center h-10"></div>
        <div className="flex items-center h-10"></div>
        {/* Row 3 */}
        <div className="flex items-center h-10">
          <label className="flex items-center gap-2 w-full">
            <span className="text-gray-400">Keep Alive</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-20 bg-transparent text-white font-bold border-none px-2 py-1 focus:outline-none text-right appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={keepAlive}
              onChange={e => setKeepAlive(Number(e.target.value))}
              onWheel={e => e.currentTarget.blur()}
            />
          </label>
        </div>
        <div className="flex items-center h-10">
          <span className="text-gray-400 mr-2">Last-Will QoS</span>
          <select
            className="bg-[#18181b] border-none rounded px-2 py-1 text-white"
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
            <span className="text-gray-400 font-semibold">Last-Will Retain</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MQTTPanel; 