import React, { useState } from 'react';
import useThemeClass from '../../../hooks/useThemeClass';
import JsonViewer from './response/JsonViewer';

const bottomPanelTabs = [
  { key: 'json', label: 'JSON' },
  { key: 'raw', label: 'RAW' },
  { key: 'headers', label: 'Headers' },
  { key: 'test-results', label: 'Test Results' },
];

type BottomPanelTab = (typeof bottomPanelTabs)[number]['key'];

interface BottomPanelProps {
  requestTime?: number | null; // in milliseconds
  responseSize?: string | null; // formatted string like '2.41 KB'
  statusCode?: number | null;
  statusText?: string | null;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  requestTime = null,
  responseSize = null,
  statusCode = null,
  statusText = null,
}) => {
  const { themeClass, borderClass } = useThemeClass();
  const [activeTab, setActiveTab] = useState<BottomPanelTab>('json');

  return (
    <div className={`w-full h-full bg-bg text-text shadow-inner z-30 ${themeClass} ${borderClass} flex flex-col`}>
      {/* Status bar */}
      <div className="flex items-center h-8 px-4 text-xs border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 gap-6">
        {statusCode !== null && statusText !== null && (
          <div>
            <span className="font-semibold">Status:</span>
            <span className={`ml-1 ${statusCode >= 200 && statusCode < 300 ? 'text-green-400' : 'text-red-400'}`}>
              {statusCode} • {statusText}
            </span>
          </div>
        )}
        {requestTime !== null && (
          <div>
            <span className="font-semibold">Time:</span>
            <span className="text-cyan-400 ml-1">{requestTime} ms</span>
          </div>
        )}
        {responseSize !== null && (
          <div>
            <span className="font-semibold">Size:</span>
            <span className="text-lime-400 ml-1">{responseSize}</span>
          </div>
        )}
      </div>
      
      {/* Tabs header */}
      <nav className={`flex items-center h-10 border-b ${borderClass} bg-bg px-4 gap-2`}>
        {bottomPanelTabs.map(tab => (
          <button
            key={tab.key}
            aria-label={tab.label}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${activeTab === tab.key ? 'text-accent font-semibold' : 'text-gray-400 hover:text-foreground'}`}
            onClick={() => setActiveTab(tab.key as BottomPanelTab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Content */}
      <div className="flex-1 overflow-auto p-4 text-gray-400">
        {activeTab === 'json' && (
          <JsonViewer />
        )}
        
        {activeTab === 'raw' && (
          <div className="whitespace-pre-wrap font-mono text-sm">
            {/* Raw response content will go here */}
            Raw response content will be displayed here
          </div>
        )}
        
        {activeTab === 'headers' && (
          <div className="text-sm">
            {/* Headers will be listed here */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="font-medium">Content-Type:</div>
              <div>application/json</div>
              <div className="font-medium">Date:</div>
              <div>{new Date().toUTCString()}</div>
              <div className="font-medium">Status:</div>
              <div>200 OK</div>
            </div>
          </div>
        )}
        
        {activeTab === 'test-results' && (
          <div className="text-sm">
            {/* Test results will be listed here */}
            <div className="mb-2">
              <div className="flex items-center text-green-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Status code is 200
              </div>
              <div className="text-xs text-gray-500 ml-6">PASS: Expected response code 200</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomPanel;
