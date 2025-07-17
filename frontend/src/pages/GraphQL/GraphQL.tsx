// File: GraphQL.tsx
// Type: Page (main entry for GraphQL feature)
// Imports: GraphQLTopBar, GraphQLTabBar, GraphQLTabContentArea, GraphQLSecondaryTabBar, GraphQLHelpPanel
// Imported by: App.tsx (via route)
// Role: Main container for the GraphQL feature, manages tab state and renders the GraphQL UI.
// Located at: src/pages/GraphQL/GraphQL.tsx
import React, { useState, useRef } from 'react';
import GraphQLTopBar from './GraphQLTopBar';
import GraphQLTabBar from './GraphQLTabBar';
import GraphQLTabContentArea from './GraphQLTabContentArea';
import GraphQLSecondaryTabBar from './GraphQLSecondaryTabBar';
// import GraphQLHelpPanel from './GraphQLHelpPanel';
import GraphQLRightPanel from './GraphQLRightPanel';
import { useGraphQLHistory } from '../../features/useGraphQLHistory';

import useThemeClass from '../../hooks/useThemeClass';

const MIN_RIGHT_WIDTH = 260;
const MAX_RIGHT_WIDTH = 440;
const DEFAULT_RIGHT_WIDTH = 340;

const DEFAULT_GRAPHQL_QUERY = `query Request {\n  method\n  url\n  headers {\n    key\n    value\n  }\n}`;

const createNewTab = (url: string = 'https://echo.hoppscotch.io/graphql') => ({
  id: Math.random().toString(36).substr(2, 9),
  tabName: 'Untitled',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'query',
  query: DEFAULT_GRAPHQL_QUERY,
  headers: [],
  variables: [],
  url,
});

const GraphQL: React.FC = () => {
  const [tabs, setTabs] = useState([createNewTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [endpoint, setEndpoint] = useState(tabs[0].url || 'https://echo.hoppscotch.io/graphql');
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // Use theme class hook for consistent theming
  const { themeClass } = useThemeClass();

  // GraphQL history saving
  const { saveHistory } = useGraphQLHistory();

  // Keep endpoint in sync with active tab
  React.useEffect(() => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.url !== endpoint) {
      setEndpoint(tab.url || 'https://echo.hoppscotch.io/graphql');
    }
    // eslint-disable-next-line
  }, [activeTabId]);

  // When endpoint changes, update active tab's url
  const handleSetEndpoint = (val: string) => {
    setEndpoint(val);
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, url: val } : tab));
  };

  // Send GraphQL request and save history
  const sendRequest = async (_url: string) => {
    const url = endpoint || 'https://echo.hoppscotch.io/graphql';
    try {
      // Log the URL for debugging
      console.log('Sending GraphQL request to URL:', url);
      // Always send a harmless default query to satisfy GraphQL server
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query: '{ __typename }' })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      // Save only URL to history
      await saveHistory(url);
    } catch (err: any) {
      alert('Error sending GraphQL request: ' + (err?.message || err));
    }
  };

  const switchTab = (id: string) => {
    setActiveTabId(id);
    const tab = tabs.find(t => t.id === id);
    setEndpoint(tab?.url || 'https://echo.hoppscotch.io/graphql');
  };
  const addTab = () => {
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
  const setModalValue = (id: string, val: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, modalValue: val } : tab));
  };
  const updateTab = (id: string, field: string, value: any) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, [field]: value } : tab));
  };
  const activeTabObj = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = rightWidth;
    document.body.style.cursor = 'col-resize';
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = dragStartWidth.current - (e.clientX - dragStartX.current);
      if (newWidth < MIN_RIGHT_WIDTH) newWidth = MIN_RIGHT_WIDTH;
      if (newWidth > MAX_RIGHT_WIDTH) newWidth = MAX_RIGHT_WIDTH;
      setRightWidth(newWidth);
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [dragging]);

  // Add a function to open a new tab from history (url + query)
  const openTabFromHistory = ({ url, query }: { url: string; query: string }) => {
    const newTab = {
      ...createNewTab(),
      url,
      query,
      tabName: url,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  // Listen for custom event from right panel to open tab from history
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.url && detail.query) {
        openTabFromHistory(detail);
      }
    };
    window.addEventListener('open-graphql-history-tab', handler);
    return () => window.removeEventListener('open-graphql-history-tab', handler);
  }, [tabs]);

  return (
    <div className={`flex flex-row h-full w-full bg-bg text-text ${themeClass}`}>

      {/* Main content: center, vertical stack */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Top bar */}
        <GraphQLTopBar endpoint={endpoint} setEndpoint={handleSetEndpoint} />
        {/* Tab bar (make scrollable on mobile) */}
        <div className="overflow-x-auto whitespace-nowrap">
          <GraphQLTabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onSwitchTab={switchTab}
            onAddTab={addTab}
            onCloseTab={closeTab}
            onOpenModal={openModal}
            onCloseModal={closeModal}
            onSaveModal={saveModal}
            onSetModalValue={setModalValue}
          />
        </div>
        {/* Secondary tab bar (make scrollable on mobile) */}
        <div className="overflow-x-auto whitespace-nowrap">
          <GraphQLSecondaryTabBar
            activeTab={activeTabObj.activeTab}
            onChange={tab => updateTab(activeTabId, 'activeTab', tab)}
          />
        </div>
        {/* Center content and bottom panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <GraphQLTabContentArea
            activeTabObj={activeTabObj}
            activeTabId={activeTabId}
            updateTab={updateTab}
            sendRequest={sendRequest}
          />
          {/* Only show bottom panel on sm+ */}
          {/* <div className="hidden sm:block w-full h-full">
            <ResizableBottomPanel>
              <HelpShortcutPanel documentationUrl="https://your-graphql-docs-link.com" />
            </ResizableBottomPanel>
          </div> */}
        </div>
      </div>
      {/* Drag handle between center and right panel (hide on mobile) */}
      <div
        className="w-2 h-full cursor-col-resize bg-border hover:bg-blue-600 transition hidden sm:block"
        style={{ zIndex: 40 }}
        onMouseDown={handleMouseDown}
      />
      {/* Right: GraphQLRightPanel, resizable width, stretches top to bottom (hide on mobile) */}
      <div className="h-full hidden sm:block" style={{ width: rightWidth, zIndex: 30 }}>
        <GraphQLRightPanel />
      </div>
    </div>
  );
};

export default GraphQL; 