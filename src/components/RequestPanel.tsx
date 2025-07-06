import React from 'react';
import ParametersTab from './ParametersTab';
import BodyTab from './BodyTab';
import AuthorizationTab from './AuthorizationTab';
import ScriptTab from './ScriptTab';
import ResponsePanel from './ResponsePanel';
import DraggableHeaders from './DraggableHeaders';
import type { DraggableHeader } from './DraggableHeaders';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
const tabs = [
  'Parameters',
  'Body',
  'Headers',
  'Authorization',
  'Pre-request Script',
  'Post-request Script',
];

const RequestPanel: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = React.useState('GET');
  const [activeTab, setActiveTab] = React.useState('Parameters');
  const [headers, setHeaders] = React.useState<DraggableHeader[]>([{ key: '', value: '' }]);

  let tabContent: React.ReactNode = null;
  if (activeTab === 'Parameters') tabContent = <ParametersTab />;
  else if (activeTab === 'Body') tabContent = <BodyTab />;
  else if (activeTab === 'Headers') tabContent = (
    <DraggableHeaders
      headers={headers}
      setHeaders={setHeaders}
      title="Headers"
    />
  );
  else if (activeTab === 'Authorization') tabContent = <AuthorizationTab />;
  else if (activeTab === 'Pre-request Script') tabContent = <ScriptTab label="Pre-request Script" />;
  else if (activeTab === 'Post-request Script') tabContent = <ScriptTab label="Post-request Script" />;
  else tabContent = <div className="text-center">{activeTab} Content (stub)</div>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-10 bg-zinc-800 rounded-lg shadow-lg">
        {/* Method, URL, Buttons */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-700">
          <select
            value={selectedMethod}
            onChange={e => setSelectedMethod(e.target.value)}
            className="bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none font-semibold"
          >
            {methods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="https://echo.hoppscotch.io"
            className="flex-1 bg-zinc-700 text-zinc-200 rounded px-3 py-1.5 focus:outline-none placeholder-zinc-400 text-sm"
          />
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded text-sm font-semibold ml-2">Send</button>
          <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-1.5 rounded text-sm font-semibold ml-1">Save</button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-2 border-b border-zinc-700">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium rounded-t transition-colors duration-150 focus:outline-none ${
                activeTab === tab
                  ? 'bg-zinc-900 text-violet-400 border-b-2 border-violet-500'
                  : 'text-zinc-400 hover:text-violet-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="px-6 py-8 text-zinc-400">
          {tabContent}
        </div>
      </div>
      <ResponsePanel />
    </>
  );
};

export default RequestPanel; 