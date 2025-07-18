// File: GraphQL.tsx
// Type: Page (main entry for GraphQL feature)
// Imports: GraphQLTopBar, GraphQLTabBar, GraphQLTabContentArea, GraphQLSecondaryTabBar, GraphQLHelpPanel
// Imported by: App.tsx (via route)
// Role: Main container for the GraphQL feature, manages tab state and renders the GraphQL UI.
// Located at: src/pages/GraphQL/GraphQL.tsx
import React, { useState, useCallback, useEffect } from 'react';
import GraphQLTopBar from './GraphQLTopBar';
import GraphQLTabBar from './GraphQLTabBar';
import GraphQLTabContentArea from './GraphQLTabContentArea';
import GraphQLSecondaryTabBar from './GraphQLSecondaryTabBar';
import GraphQLRightPanel from './GraphQLRightPanel';
import useThemeClass from '../../hooks/useThemeClass';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api';

const MIN_RIGHT_WIDTH = 260;
const MAX_RIGHT_WIDTH = 440;
const DEFAULT_RIGHT_WIDTH = 340;

interface GraphQLTab {
  id: string;
  tabName: string;
  showModal: boolean;
  modalValue: string;
  activeTab: string;
  query: string;
  headers: any[]; // Using any[] temporarily to fix the Header type issue
  variables: any[]; // Changed to match GraphQLTabBar's expected type
  endpoint?: string;
}

const createNewTab = (): GraphQLTab => ({
  id: `tab-${Date.now()}`,
  tabName: 'Untitled',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'query',
  query: '',
  headers: [],
  variables: [],
  endpoint: '',
});

const GraphQL: React.FC = () => {
  const [tabs, setTabs] = useState<GraphQLTab[]>([createNewTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [isRightPanelOpen] = useState(true);
  const [currentEndpoint, setCurrentEndpoint] = useState('https://echo.hoppscotch.io/graphql');
  const { themeClass } = useThemeClass();
  
  // Tab management functions
  const handleAddTab = () => {
    const newTab = createNewTab();
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const idx = tabs.findIndex(tab => tab.id === id);
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
    }
  };

  const openModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, showModal: true } : tab));
  };
  
  const closeModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, showModal: false } : tab));
  };
  
  const saveModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, tabName: tab.modalValue, showModal: false } : tab));
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  // Handle tab change
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  // Handle endpoint change from the top bar
  const handleEndpointChange = useCallback(async (endpoint: string) => {
    setCurrentEndpoint(endpoint);
    updateTab(activeTabId, { endpoint });
    
    // Save endpoint to backend
    try {
      const response = await apiService.saveGraphQLEndpointHistory({ url: endpoint });
      if (!response.success) {
        console.error('Failed to save endpoint to history:', response.error);
      }
    } catch (error) {
      console.error('Error saving endpoint to history:', error);
    }
  }, [activeTabId]);

  // Update tab function with proper typing
  const updateTab = useCallback((id: string, updates: string | Partial<GraphQLTab>, value?: any) => {
    if (typeof updates === 'string') {
      // Single property update
      setTabs(tabs => tabs.map(tab => 
        tab.id === id ? { ...tab, [updates]: value } : tab
      ));
    } else {
      // Multiple properties update
      setTabs(tabs => tabs.map(tab => 
        tab.id === id ? { ...tab, ...updates } : tab
      ));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPanelWidth;
    document.body.style.cursor = 'col-resize';
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (moveEvent.buttons !== 1) { // Left mouse button is not pressed anymore
        handleMouseUp();
        return;
      }
      
      // Calculate the difference in X position
      const diffX = moveEvent.clientX - startX;
      
      // Calculate new width by subtracting the difference from the starting width
      // This makes dragging left decrease width and dragging right increase it
      let newWidth = startWidth - diffX;
      
      // Apply min/max constraints
      newWidth = Math.max(MIN_RIGHT_WIDTH, Math.min(newWidth, MAX_RIGHT_WIDTH));
      
      setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [rightPanelWidth]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  useEffect(() => {
    if (!activeTabId && tabs.length > 0) {
      setActiveTabId(tabs[0].id);
    }
  }, [activeTabId, tabs]);

  return (
    <div className={`flex flex-col sm:flex-row h-full w-full bg-bg text-text ${themeClass}`}>
      {/* Main content: left side, vertical stack */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Top bar */}
        <GraphQLTopBar 
          onEndpointChange={handleEndpointChange}
          initialEndpoint={currentEndpoint}
        />
        {/* Tab bar (make scrollable on mobile) */}
        <div className={`flex-1 flex flex-col h-full ${themeClass}`}>
          <GraphQLTabBar 
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={handleTabChange}
            onSetModalValue={(id, val) => updateTab(id, 'modalValue', val)}
            onCloseTab={closeTab}
            onAddTab={handleAddTab}
            onOpenModal={openModal}
            onCloseModal={closeModal}
            onSaveModal={saveModal}
          />
          <GraphQLSecondaryTabBar 
            activeTab={activeTab.activeTab} 
            onChange={(tab) => updateTab(activeTab.id, { activeTab: tab })} 
          />
          <div className="flex-1 overflow-hidden">
            <GraphQLTabContentArea 
              activeTabId={activeTab.activeTab}
              query={activeTab.query || ''}
              variables={activeTab.variables || []}
              headers={activeTab.headers || []}
              onQueryChange={(query) => updateTab(activeTab.id, { query })}
              onVariablesChange={(variables) => updateTab(activeTab.id, { variables })}
              onHeadersChange={(headers) => updateTab(activeTab.id, { headers })}
              onUpdateTab={updateTab}
              activeTab={activeTab}
            />
          </div>
        </div>
        {/* Only show bottom panel on sm+ */}
        {/* <div className="hidden sm:block w-full h-full">
          <ResizableBottomPanel>
            <HelpShortcutPanel documentationUrl="https://your-graphql-docs-link.com" />
          </ResizableBottomPanel>
        </div> */}
      </div>
      {/* Drag handle between center and right panel (hide on mobile) */}
      <div
        className="w-2 h-full cursor-col-resize bg-border hover:bg-blue-600 transition hidden sm:block"
        style={{ zIndex: 40 }}
        onMouseDown={handleMouseDown}
      />
      {/* Right: GraphQLRightPanel, resizable width, stretches top to bottom (hide on mobile) */}
      <div className="h-full hidden sm:block" style={{ width: rightPanelWidth, zIndex: 30 }}>
        {isRightPanelOpen && (
          <GraphQLRightPanel 
            currentEndpoint={currentEndpoint}
            onSelectEndpoint={(endpoint) => {
              setCurrentEndpoint(endpoint);
              toast.success('Endpoint loaded from history');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GraphQL;