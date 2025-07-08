// File: GraphQL.tsx
// Type: Page (main entry for GraphQL feature)
// Imports: GraphQLTopBar, GraphQLTabBar, GraphQLTabContentArea, GraphQLSecondaryTabBar, GraphQLHelpPanel
// Imported by: App.tsx (via route)
// Role: Main container for the GraphQL feature, manages tab state and renders the GraphQL UI.
// Located at: src/pages/GraphQL/GraphQL.tsx
import React, { useState } from 'react';
import GraphQLTopBar from './GraphQLTopBar';
import GraphQLTabBar from './GraphQLTabBar';
import GraphQLTabContentArea from './GraphQLTabContentArea';
import GraphQLSecondaryTabBar from './GraphQLSecondaryTabBar';
import GraphQLHelpPanel from './GraphQLHelpPanel';
import { useSelector } from 'react-redux';

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

  return (
   <div className={`flex h-full w-full bg-bg text-text ${themeClass}`}>
      <div className="flex flex-col flex-1">
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
        {/* Tab Content */}
        <div className="flex flex-1">
          {/* Left: Tab content */}
          <GraphQLTabContentArea
            activeTabObj={activeTabObj}
            activeTabId={activeTabId}
            updateTab={updateTab}
          />
          {/* Right: Help/Shortcuts Panel */}
          <GraphQLHelpPanel />
        </div>
      </div>
    </div>
  );
};

export default GraphQL; 