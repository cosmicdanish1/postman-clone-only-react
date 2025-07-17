import React, { useState } from 'react';
import useThemeClass from '../../../hooks/useThemeClass';
import JsonViewer from './response/JsonViewer';
import RawViewer from './response/RawViewer';
import HeadersViewer from './response/HeadersViewer';

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
  const [hasRequestBeenMade, setHasRequestBeenMade] = useState(false);
  
  // Show tabs if we have any response data
  const shouldShowTabs = hasRequestBeenMade || requestTime !== null;
  
  // Sample empty response data
  const responseData = {
    method: 'GET',
    args: {},
    data: '',
    headers: {},
    path: '/',
    isBase64Encoded: false
  };
  
  // Update hasRequestBeenMade when we receive response data
  React.useEffect(() => {
    if (requestTime !== null) {
      setHasRequestBeenMade(true);
    }
  }, [requestTime]);

  if (!shouldShowTabs) {
    return (
      <div className={`w-full h-full bg-bg text-text shadow-inner z-30 ${themeClass} ${borderClass} flex flex-col items-center justify-center`}>
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between text-gray-400 px-32  py-2">
            <span>Send Request</span>
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 py-0.5 text-gray-800">Ctrl ↵</span>
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 py-0.5 ml-2 text-gray-800">↵</span>
          </div>

          <div className="flex items-center justify-between text-gray-400 px-32 py-2">
            <span>Keyboard shortcuts</span>
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 py-0.5 text-gray-800">Ctrl</span>
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 ml-2 py-0.5 text-gray-800">/</span>
          </div>

          <div className="flex items-center justify-between text-gray-400 px-32 py-2">
            <span>Search & command menu</span>
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 py-0.5 text-gray-800">Ctrl</span>
            
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 ml-2 py-0.5 text-gray-800">K</span>
          </div>

          <div className="flex items-center justify-between text-gray-400 px-28 py-2">
            <span>Help menu</span>
            <span className="text-sm bg-[#F3F4F6] border border-gray-300 rounded px-2 py-0.5 text-gray-800">?</span>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="https://docs.hoppscotch.io/documentation/features/rest-api-testing#response"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gray-600 px-4 py-2 rounded text-gray-400"
            >
              Documentation ↗
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-bg text-text shadow-inner z-30 flex flex-col ${themeClass}`}>
      {/* Status bar */}
      <div className={`flex items-center h-8 px-4 text-xs border-b gap-6 ${borderClass} ${themeClass} bg-opacity-50`}>
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
      <nav className={`flex items-center h-10 border-b px-4 gap-2 ${borderClass} ${themeClass} bg-opacity-50`}>
        {bottomPanelTabs.map((tab) => (
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
      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'json' && <JsonViewer />}
        {activeTab === 'raw' && <RawViewer data={responseData} />}
        {activeTab === 'headers' && (
          <HeadersViewer 
            headers={{
              ...responseData.headers,
              'content-type': 'application/json',
              'date': new Date().toUTCString()
            }} 
            className="h-full"
          />
        )}
        
        {activeTab === 'test-results' && (
          <div className={`text-sm ${themeClass}`}>
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
