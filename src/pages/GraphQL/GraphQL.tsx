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
import HelpShortcutPanel from '../../components/HelpShortcutPanel';
import ResizableBottomPanel from '../../components/ResizableBottomPanel';
import GraphQLRightPanel from './GraphQLRightPanel';
import { useSelector } from 'react-redux';

const MIN_RIGHT_WIDTH = 260;
const MAX_RIGHT_WIDTH = 440;
const DEFAULT_RIGHT_WIDTH = 340;

const createNewTab = () => ({
  id: Math.random().toString(36).substr(2, 9),
  tabName: 'Untitled',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'query',
  query: '',
  headers: [],
  variables: [],
});

const GraphQL: React.FC = () => {
  const [tabs, setTabs] = useState([createNewTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // Theming logic
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  const switchTab = (id: string) => setActiveTabId(id);
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

  return (
   <div className={`flex h-full w-full bg-bg text-text ${themeClass}`}>
      {/* Main content: left side, vertical stack */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Top bar */}
        <GraphQLTopBar />
        {/* Tab bar */}
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
        {/* Secondary tab bar */}
        <GraphQLSecondaryTabBar
          activeTab={activeTabObj.activeTab}
          onChange={tab => updateTab(activeTabId, 'activeTab', tab)}
        />
        {/* Center content and bottom panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <GraphQLTabContentArea
            activeTabObj={activeTabObj}
            activeTabId={activeTabId}
            updateTab={updateTab}
          />
          <ResizableBottomPanel>
            <HelpShortcutPanel documentationUrl="https://your-graphql-docs-link.com" />
          </ResizableBottomPanel>
        </div>
      </div>
      {/* Drag handle between center and right panel */}
      <div
        className="w-2 h-full cursor-col-resize bg-border hover:bg-blue-600 transition"
        style={{ zIndex: 40 }}
        onMouseDown={handleMouseDown}
      />
      {/* Right: GraphQLRightPanel, resizable width, stretches top to bottom */}
      <div className="h-full" style={{ width: rightWidth, zIndex: 30 }}>
        <GraphQLRightPanel />
      </div>
    </div>
  );
};

export default GraphQL; 