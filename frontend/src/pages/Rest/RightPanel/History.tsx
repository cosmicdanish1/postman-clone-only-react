import React, { useCallback, useEffect, useState } from 'react';
import { useRequestHistory } from '../../../features/useRequestHistory';
import { formatDate, formatTime, groupHistoryByTime } from '../../../utils/timeUtils';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface HistoryItem {
  id: number;
  method: string;
  url: string;
  created_at: string;
  is_favorite: boolean;
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
  favorite: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
};

const getMethodColor = (method: string): string => {
  const methodColors: { [key: string]: string } = {
    GET: 'text-green-500',
    POST: 'text-blue-500',
    PUT: 'text-yellow-500',
    DELETE: 'text-red-500',
    PATCH: 'text-purple-500',
    HEAD: 'text-pink-500',
    OPTIONS: 'text-indigo-500'
  };
  return methodColors[method.toUpperCase()] || ' text-gray-800';
};



const History: React.FC = () => {
  const { 
    history, 
    loading, 
    error, 
    refreshHistory, 
    clearHistory, 
    deleteHistory, 
    toggleFavorite 
  } = useRequestHistory();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (history) {
      const newGroups = new Set<string>();
      Object.keys(groupHistoryByTime(history)).forEach(group => {
        newGroups.add(group);
      });
      setExpandedGroups(newGroups);
    }
  }, [history]);

  useEffect(() => {
    const update = () => {
      setCurrentTime(Date.now());
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Set up auto-refresh
  useEffect(() => {
    // Initial load
    const loadHistory = async () => {
      try {
        await refreshHistory();
      } catch (error) {
        console.error('Error refreshing history:', error);
      }
    };
    
    loadHistory();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(loadHistory, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshHistory]);

  const handleDeleteAll = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete all history?')) {
      try {
        await clearHistory();
        // No need to manually refresh as the history state will update automatically
      } catch (error) {
        console.error('Error deleting history:', error);
      }
    }
  }, [clearHistory]);

  const handleDeleteItem = useCallback(async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteHistory(itemId);
        // No need to manually refresh as the history state will update automatically
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  }, [deleteHistory]);

  const handleToggleFavorite = useCallback(async (item: HistoryItem) => {
    try {
      await toggleFavorite(item.id);
      // No need to manually refresh as the history state will update automatically
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [toggleFavorite]);

  const handleItemClick = useCallback((item: HistoryItem) => {
    console.log('History item clicked:', item);
  }, []);

  if (loading && history.length === 0) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16  rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">Error loading history: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 ">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Personal Workspace</span>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -2 27 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
          
          <span>History</span>
        </div>
        
        {/* Icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDeleteAll}
            disabled={loading}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Clear all history"
          >
            {ICONS.delete}
          </button>
          <button className="p-1 hover:text-blue-500 transition-colors" title="Help">{ICONS.help}</button>
          <button className="p-1 hover:text-blue-500 transition-colors" title="Filter">{ICONS.filter}</button>
          
        </div>
      </div>
      
      {/* Search bar */}
      <div className="px-4 py-2 ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history..."
            className="w-full pl-8 pr-4 py-2 text-sm rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <div className="animate-spin rounded-full h-8 w-8   mb-2"></div>
            <p className="text-sm text-gray-500">Loading history...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500 mb-2">Error: {error}</p>
          </div>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No history yet</p>
                <p className="text-sm text-gray-400 mt-1">Your request history will appear here</p>
              </div>
            ) : (
              <div>
                {Object.entries(groupHistoryByTime(history)).map(([timeGroup, items]) => (
                  <div key={timeGroup} className="space-y-2">
                    <button 
                      onClick={() => {
                        setExpandedGroups(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(timeGroup)) {
                            newSet.delete(timeGroup);
                          } else {
                            newSet.add(timeGroup);
                          }
                          return newSet;
                        });
                      }}
                      className="w-full flex items-center justify-between px-3 py-2  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg 
                          className={`w-4 h-4 ${expandedGroups.has(timeGroup) ? 'rotate-90' : ''} transition-transform`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <h3 className="text-sm font-medium ml-2">{timeGroup}</h3>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{items.length} items</span>
                    </button>
                    {expandedGroups.has(timeGroup) && (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className="p-3  cursor-pointer transition-colors relative group"
                          >
                            <div className="flex items-start gap-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(item.method)}`}>
                                {item.method.toUpperCase()}
                              </span>
                              <div className="flex-1">
                                <Tippy
                                  content={`${formatDate(item.created_at)} at ${formatTime(item.created_at)}`}
                                  followCursor={true}
                                  arrow={true}
                                  theme="light"
                                  animation="fade"
                                  duration={200}
                                  interactive={true}
                                  offset={[0, 10]}
                                >
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {item.url || 'No URL'}
                                  </p>
                                </Tippy>
                              </div>
                              <div className="flex items-center gap-2 ml-2 absolute right-3 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity duration-200">
                                <Tippy
                                  content={item.is_favorite ? 'Remove star' : 'Add star'}
                                  placement="top"
                                  arrow={true}
                                  theme="light"
                                  animation="fade"
                                  duration={200}
                                  interactive={true}
                                >
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavorite(item);
                                    }}
                                    className={`p-1 ${item.is_favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                  </button>
                                </Tippy>
                                <Tippy
                                  content="Remove"
                                  placement="top"
                                  arrow={true}
                                  theme="light"
                                  animation="fade"
                                  duration={200}
                                  interactive={true}
                                >
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(item.id);
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </Tippy>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Debug info - visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 text-xs text-gray-500">
          <div>Items: {history?.length || 0}</div>
          <div>Status: {loading ? 'Loading...' : error ? 'Error' : 'Ready'}</div>
        </div>
      )}
    </div>
  );
};

export default History;