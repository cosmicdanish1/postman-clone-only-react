import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRequestHistory } from '../../../features/useRequestHistory';

interface HistoryItem {
  id: number;
  method: string;
  url: string;
  month: string;
  day: string;
  year: string;
  time: string;
  created_at: string;
}

const ICON_SIZE = 20;

const ICONS = {
  help: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 13a2 2 0 1 0-2-2m2 2v2m0-10a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>
    </svg>
  ),
  filter: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-4.586a1 1 0 0 0-.293-.707L2.293 6.707A1 1 0 0 1 2 6V4Z"/>
    </svg>
  ),
  delete: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12Z"/>
    </svg>
  ),
};

const History: React.FC = () => {
  const theme = useSelector((state: { theme: { theme: string } }) => state.theme.theme);
  const isDarkMode = theme === 'dark' || theme === 'black';
  
  const { history, loading, error, refreshHistory } = useRequestHistory();
  
  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    refreshHistory().catch(console.error);
  }, [refreshHistory]);

  // Handle history item click
  const handleItemClick = useCallback((item: HistoryItem) => {
    console.log('History item clicked:', item);
    // You can add logic to handle item click here
  }, []);

  // Test direct API call
  const testDirectApi = useCallback(async () => {
    console.log('Testing direct API call...');
    try {
      const response = await fetch('http://localhost:5000/api/history');
      const data = await response.json();
      console.log('Direct API response:', data);
      
      if (data?.items) {
        console.log('First item from direct API:', data.items[0]);
      }
    } catch (err) {
      console.error('Direct API error:', err);
    }
  }, []);

  if (loading && history.length === 0) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">Error loading history: {error}</div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Personal Workspace</span>
          <span className="text-gray-400">/</span>
          <span>History</span>
        </div>
        
        {/* Icons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={testDirectApi}
            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
            title="Test API"
          >
            Test API
          </button>
          <button 
            onClick={handleRefresh} 
            className="hover:text-blue-500 transition-colors" 
            title="Refresh"
            disabled={loading}
          >
            <svg 
              width={ICON_SIZE} 
              height={ICON_SIZE} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={1.5} 
              viewBox="0 0 24 24"
              className={`${loading ? 'animate-spin' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button className="hover:text-blue-500 transition-colors" title="Help">{ICONS.help}</button>
          <button className="hover:text-blue-500 transition-colors" title="Filter">{ICONS.filter}</button>
          <button className="hover:text-red-500 transition-colors" title="Delete All">{ICONS.delete}</button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history..."
            className="w-full pl-8 pr-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto">
        {loading && !history.length ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-500">Loading history...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Retry
            </button>
          </div>
        ) : !history?.length ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No history yet</p>
            <p className="text-sm text-gray-400 mt-1">Your request history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((item) => (
              <div
                key={`${item.id}-${item.created_at}`}
                onClick={() => handleItemClick(item)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <div className="flex items-start">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    item.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    item.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    item.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.method}
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.url || 'No URL'}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.time || '--:--'}</span>
                    <span className="mx-1">•</span>
                    <span>{`${item.day || '--'}/${item.month || '--'}/${item.year || '----'}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Debug info - visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700">
          <div>Items: {history?.length || 0}</div>
          <div>Status: {loading ? 'Loading...' : error ? 'Error' : 'Ready'}</div>
        </div>
      )}
    </div>
  );
};

export default History;