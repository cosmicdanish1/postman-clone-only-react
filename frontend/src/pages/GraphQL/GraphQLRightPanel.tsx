import React, { useState, useRef, useEffect, useCallback } from 'react';
import useThemeClass from '../../hooks/useThemeClass';
import { apiService } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

// Define the GraphQL endpoint history item types
interface GraphQLEndpointHistoryData {
  id: number;
  url: string;
  created_at?: string;
}

interface GraphQLEndpoint extends GraphQLEndpointHistoryData {
  created_at: string; // Make created_at required in our UI
}

const icons = [
  // Book (active)
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  ),
  // Cube
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  // Folder
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 3h6a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // Clock
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
];

// Panel content components
const SchemaPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">{t('graphql.schema')}</h3>
      <div className="text-gray-400">{t('graphql.schema_placeholder')}</div>
    </div>
  );
};

const ExplorerPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">{t('graphql.explorer')}</h3>
      <div className="text-gray-400">{t('graphql.explorer_placeholder')}</div>
    </div>
  );
};

const CollectionsPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">{t('graphql.collections')}</h3>
      <div className="text-gray-400">{t('graphql.collections_placeholder')}</div>
    </div>
  );
};

interface HistoryPanelProps {
  history: GraphQLEndpoint[];
  onSelectHistory: (item: GraphQLEndpoint) => void;
  onDeleteHistory: (id: number) => void;
  currentEndpoint?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onSelectHistory, 
  onDeleteHistory,
  currentEndpoint 
}) => {
  const { t } = useTranslation();
  
  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        {t('graphql.history.empty')}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-700">
      {history.map((item) => {
        const isCurrent = item.url === currentEndpoint;
        return (
          <div 
            key={item.id}
            className={`p-3 cursor-pointer group flex justify-between items-center ${
              isCurrent 
                ? 'bg-blue-500/10 border-l-2 border-blue-500' 
                : 'hover:bg-gray-800/50'
            }`}
            onClick={() => onSelectHistory(item)}
          >
            <div className="truncate flex-1">
              <div className="font-medium text-gray-200 truncate flex items-center">
                {item.url}
                {isCurrent && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    {t('common.current')}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <button 
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(t('graphql.history.delete_confirm'))) {
                  onDeleteHistory(item.id);
                }
              }}
              title={t('common.delete')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const MIN_WIDTH = 260;
const DEFAULT_WIDTH = 340;
const MAX_WIDTH = 500; // Limited maximum width

interface GraphQLEndpoint {
  id: number;
  url: string;
  created_at: string;
}

interface GraphQLRightPanelProps {
  onSelectEndpoint?: (url: string) => void;
  currentEndpoint?: string;
}

const GraphQLRightPanel: React.FC<GraphQLRightPanelProps> = ({ onSelectEndpoint, currentEndpoint = '' }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const [hovered, setHovered] = useState(false);
  const [history, setHistory] = useState<GraphQLEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const startX = useRef(0);
  const startWidth = useRef(width);

  // Use theme class hook for consistent theming
  const { themeClass, accentColor, borderClass } = useThemeClass();
  const { t } = useTranslation();

  // Fetch history on component mount
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data: GraphQLEndpointHistoryData[] = await apiService.getGraphQLEndpointHistory();
      // Ensure the data is in the correct format with required created_at
      const formattedData: GraphQLEndpoint[] = Array.isArray(data) 
        ? data.map(item => ({
            ...item,
            created_at: item.created_at || new Date().toISOString()
          }))
        : [];
      setHistory(formattedData);
    } catch (error) {
      console.error('Failed to fetch GraphQL history:', error);
      toast.error(t('graphql.history.fetch_error') || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Save endpoint to history when currentEndpoint changes
  useEffect(() => {
    let isMounted = true;
    
    const saveCurrentEndpoint = async () => {
      if (!currentEndpoint || !currentEndpoint.trim()) return;
      
      try {
        await apiService.saveGraphQLEndpointHistory({ url: currentEndpoint });
        if (isMounted) {
          await fetchHistory(); // Refresh the history list
        }
      } catch (error) {
        console.error('Failed to save GraphQL endpoint:', error);
        if (isMounted) {
          toast.error(t('graphql.history.save_error') || 'Failed to save endpoint');
        }
      }
    };

    // Only save if we have a valid endpoint and it's not already in history
    if (currentEndpoint && !history.some(item => item.url === currentEndpoint)) {
      saveCurrentEndpoint();
    }

    return () => {
      isMounted = false;
    };
  }, [currentEndpoint, fetchHistory, t, history]);

  const handleDeleteHistory = async (id: number) => {
    if (window.confirm(t('graphql.history.delete_confirm') || 'Are you sure you want to delete this item?')) {
      try {
        await apiService.deleteGraphQLEndpointHistory(id);
        setHistory(prev => prev.filter(item => item.id !== id));
        toast.success(t('graphql.history.delete_success') || 'Item deleted');
      } catch (error) {
        console.error('Failed to delete history item:', error);
        toast.error(t('graphql.history.delete_error') || 'Failed to delete item');
      }
    }
  };

  const handleSelectHistory = (item: GraphQLEndpoint) => {
    if (onSelectEndpoint) {
      onSelectEndpoint(item.url);
    }
  };
  
  // Use the accent color directly from the theme

  const onMouseDown = (e: React.MouseEvent, edge: 'left' | 'right') => {
    setDragging(edge);
    startX.current = e.clientX;
    startWidth.current = width;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    let newWidth = startWidth.current;
    if (dragging === 'left') {
      newWidth = startWidth.current - (e.clientX - startX.current);
    } else if (dragging === 'right') {
      newWidth = startWidth.current + (e.clientX - startX.current);
    }
    // Limited drag range - only allow small adjustments
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setWidth(newWidth);
  };

  const onMouseUp = () => {
    setDragging(null);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className={`flex flex-row h-full w-full bg-bg text-text ${themeClass}`}
      style={{ 
        width: width, 
        minWidth: MIN_WIDTH, 
        maxWidth: MAX_WIDTH, 
        transition: dragging ? 'none' : 'width 0.15s', 
        position: 'relative' 
      }}
    >
      {/* Thin left drag handle */}
      <div
        style={{ 
          width: 4, // Much thinner drag handle
          height: '100%', 
          cursor: 'ew-resize', 
          background: dragging === 'left' ? accentColor : 'transparent', 
          zIndex: 41, 
          position: 'absolute', 
          left: 0, 
          top: 0,
          transition: 'background 0.15s ease'
        }}
        onMouseDown={e => onMouseDown(e, 'left')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Resize panel"
      >
        {/* Thin accent line on hover/drag */}
        {(hovered || dragging) && (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: accentColor,
              opacity: dragging ? 1 : 0.6,
              transition: 'opacity 0.15s ease'
            }}
          />
        )}
      </div>

      {/* Sub sidebar */}
      <div className="flex flex-col items-center py-2 px-0 gap-3 bg-bg-secondary h-full w-14">
        {icons.map((icon, idx) => (
          <button
            key={idx}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150
              ${activeIdx === idx 
                ? `bg-accent/20 text-accent` 
                : 'text-text/60 hover:bg-bg-secondary hover:text-accent'
              } cursor-pointer`}
            onClick={() => setActiveIdx(idx)}
            aria-label={`Panel ${idx + 1}`}
            type="button"
          >
            {icon}
          </button>
        ))}
      </div>
      {/* Main right panel content area, changes with activeIdx */}
      <div className={`flex-1 overflow-y-auto bg-bg ${borderClass}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {activeIdx === 0 && <SchemaPanel />}
            {activeIdx === 1 && <ExplorerPanel />}
            {activeIdx === 2 && <CollectionsPanel />}
            {activeIdx === 3 && (
              <HistoryPanel 
                history={history} 
                onSelectHistory={handleSelectHistory} 
                onDeleteHistory={handleDeleteHistory}
                currentEndpoint={currentEndpoint}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GraphQLRightPanel; 