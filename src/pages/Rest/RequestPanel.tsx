// File: RequestPanel.tsx
// Type: Component (request panel)
// Imports: React, utility functions
// Imported by: CenterPanel.tsx, RestPage.tsx
// Role: Renders the panel displaying request details and controls in the REST feature.
// Located at: src/pages/Rest/RequestPanel.tsx
import React from 'react';
import ParametersTab from './ParametersTab';
import BodyTab from './BodyTab';
import AuthorizationTab from './AuthorizationTab';
import { useSelector } from 'react-redux';

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

  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  let tabContent: React.ReactNode = null;
  if (activeTab === 'Parameters') tabContent = <ParametersTab />;
  else if (activeTab === 'Body') tabContent = <BodyTab />;
  else if (activeTab === 'Headers') tabContent = (
    <div className="text-center">Headers Content (stub)</div>
  );
  else if (activeTab === 'Authorization') tabContent = <AuthorizationTab />;
  else if (activeTab === 'Pre-request Script') tabContent = <div className="text-center">Pre-request Script Content (stub)</div>;
  else if (activeTab === 'Post-request Script') tabContent = <div className="text-center">Post-request Script Content (stub)</div>;
  else tabContent = <div className="text-center">{activeTab} Content (stub)</div>;

  return (
    <>
      <div className={`w-full max-w-4xl mx-auto mt-10 bg-bg rounded-lg shadow-lg ${themeClass}`}>
        {/* Method, URL, Buttons */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <select
            value={selectedMethod}
            onChange={e => setSelectedMethod(e.target.value)}
            className="bg-bg border border-border text-text rounded px-2 py-1 text-sm focus:outline-none font-semibold"
          >
            {methods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="https://echo.hoppscotch.io"
            className="flex-1 bg-bg border border-border text-text rounded px-3 py-1.5 focus:outline-none placeholder-zinc-400 text-sm"
          />
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded text-sm font-semibold ml-2">Send</button>
          <button className="bg-bg hover:bg-bg/80 text-text px-3 py-1.5 rounded text-sm font-semibold ml-1 border border-border">Save</button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-2 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium rounded-t transition-colors duration-150 focus:outline-none ${
                activeTab === tab
                  ? 'bg-bg text-violet-400 border-b-2 border-violet-500'
                  : 'text-gray-400 hover:text-violet-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="px-6 py-8 text-text">
          {tabContent}
        </div>
      </div>
      <div className="text-center">Response Panel (stub)</div>
    </>
  );
};

export default RequestPanel; 