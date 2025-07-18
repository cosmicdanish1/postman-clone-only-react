// File: RestPage.tsx
// Type: Page (REST feature entry)
// Imports: React, various tab and panel components
// Imported by: App.tsx (via route)
// Role: Main entry point for the REST feature, renders the REST request/UI.
// Located at: src/pages/Rest/RestPage.tsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRequestHistory } from '../../features/useRequestHistory';
import { useRestTabs } from '../../hooks/useRestTabs';
import RestTabsHeader from './components/RestTabsHeader';
import HTTP_METHOD_COLORS from '../../constants/httpMethodColors';
import RequestEditorContainer from './RequestEditorContainer';
import TabContentArea from './TabContentArea/TabContentArea';
import RestRightPanel from './RightPanel/RestRightPanel';
import HistoryToTabsContext from './RightPanel/HistoryToTabsContext';
import RestSplitPane from './components/RestSplitPane';

import BottomPanel from './components/BottomPanel';

import { v4 as uuidv4 } from 'uuid';
import type { Parameter, Variable } from '../../types';
import SortableParamRow from '../../components/SortableParamRow';
import SortableHeaderRow from '../../components/SortableHeaderRow';
import SortableVariableRow from '../../components/SortableVariableRow';
import { contentTypeOptions } from '../../constants';
import useThemeClass from '../../hooks/useThemeClass';

// Utility function to move items in an array
const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(from, 1);
  newArray.splice(to, 0, movedItem);
  return newArray;
};

function HoppscotchClone() {
  // Theme and UI state
  const { themeClass } = useThemeClass();
  
  // Request stats state
  const [requestStats, setRequestStats] = useState<{
    time: number | null;
    size: string | null;
    statusCode: number | null;
    statusText: string | null;
  }>({
    time: null,
    size: null,
    statusCode: null,
    statusText: null,
  });
  
  const { saveRequest, refreshHistory } = useRequestHistory();
  
  // Generate random request stats
  const generateRequestStats = useCallback(() => {
    // Generate random time between 100ms and 2000ms
    const time = Math.floor(Math.random() * 1900) + 100;
    
    // Generate random size between 0.5KB and 10KB
    const sizeInKB = (Math.random() * 9.5 + 0.5).toFixed(2);
    
    // Always return status 200 OK
    const statusCode = 200;
    const statusText = 'OK';
    
    return {
      time,
      size: `${sizeInKB} KB`,
      statusCode,
      statusText,
    };
  }, []);

  const { 
    tabs, 
    setTabs, 
    activeTabId, 
    setActiveTabId, 
    activeTabObj, 
    addTab, 
    switchTab, 
    setActiveTab,
    setAuthorization 
  } = useRestTabs();
  // State managed by RequestEditorContainer

  // Query Parameters state and handlers
  const [queryParams, setQueryParams] = React.useState<Parameter[]>([{ id: uuidv4(), key: '', value: '', description: '' }]);

  // Content type options for Body tab
  const [contentType, setContentType] = useState('none');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Script states and refs with non-null assertion
  const [preRequestScript, setPreRequestScript] = useState('');
  const [postRequestScript, setPostRequestScript] = useState('');
  const preRequestDivRef = useRef<HTMLDivElement>(null!);
  const postRequestDivRef = useRef<HTMLDivElement>(null!);
  
  // Syntax highlighting functions
  const highlightPreRequestScript = (code: string) => code;
  const highlightPostRequestScript = (code: string) => code;

  // Script snippet handlers
  const insertPreRequestSnippet = (snippet: string) => {
    setPreRequestScript(prev => prev + '\n' + snippet);
  };

  const insertPostRequestSnippet = (snippet: string) => {
    setPostRequestScript(prev => prev + '\n' + snippet);
  };

  const handleParamChange = (id: string, field: string, value: string): void => {
    setQueryParams(prev => {
      const updated = prev.map((p) => p.id === id ? { ...p, [field]: value } : p);
      if (field === 'key' && prev[prev.length - 1].id === id && value.trim() !== '') {
        return [...updated, { id: uuidv4(), key: '', value: '', description: '' }];
      }
      return updated;
    });
  };
  const handleDeleteParam = (id: string): void => {
    setQueryParams(prev => prev.length === 1 ? prev : prev.filter((p) => p.id !== id));
  };

  const handleDeleteAllParams = (): void => {
    setQueryParams([{ id: uuidv4(), key: '', value: '', description: '' }]);
  };

  const handleAddParam = (): void => {
    setQueryParams(prev => [...prev, { id: uuidv4(), key: '', value: '', description: '' }]);
  };

  // Drag and drop handlers for Query Parameters
  const handleDragEnd = (event: any): void => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQueryParams((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Request body and headers state
  const [rawBody, setRawBody] = useState('');

  const handleHeaderChange = (id: string, field: string, value: string): void => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      let updatedHeaders = tab.headers.map((h: any) => h.id === id ? { ...h, [field]: value } : h);
      const lastEditable = updatedHeaders.filter((h: any) => !h.locked).slice(-1)[0];
      if (
        field === 'key' &&
        lastEditable &&
        lastEditable.id === id &&
        value.trim() !== '' &&
        updatedHeaders.length + 1 < 10 
      ) {
        const lockedIdx = updatedHeaders.findIndex((h: any) => h.locked);
        const newRow = { id: uuidv4(), key: '', value: '', description: '', locked: false };
        updatedHeaders = [
          ...updatedHeaders.slice(0, lockedIdx),
          newRow,
          ...updatedHeaders.slice(lockedIdx)
        ];
      }
      return { ...tab, headers: updatedHeaders };
    }));
  };
  const handleDeleteHeader = (id: string): void => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      const updatedHeaders = tab.headers.filter((h: any) => h.id !== id || h.locked);
      return { ...tab, headers: updatedHeaders };
    }));
  };
  const handleAddHeader = (): void => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      return { ...tab, headers: [...tab.headers, { id: uuidv4(), key: '', value: '', description: '', locked: false }] };
    }));
  };

  // Handle send request - implemented in RequestEditorContainer

  // Variables state and handlers
  const [variables, setVariables] = React.useState<Variable[]>([{ id: uuidv4(), key: '', value: '' }]);

  const handleVariableChange = (id: string, field: string, value: string): void => {
    setVariables(prev => {
      const updated = prev.map((v) => v.id === id ? { ...v, [field]: value } : v);
      const last = updated[updated.length - 1];
      if ((last.key !== '' || last.value !== '') && prev.length === updated.length) {
        return [...updated, { id: uuidv4(), key: '', value: '' }];
      }
      return updated;
    });
  };
  const handleDeleteVariable = (id: string): void => {
    setVariables(prev => prev.length === 1 ? prev : prev.filter((v) => v.id !== id));
  };
  const handleVariableDragEnd = (event: any): void => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setVariables((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Function to open a new tab with method and url from history
  const openTabFromHistory = React.useCallback(({ url, method }: { url: string; method: string }) => {
    setTabs(prevTabs => {
      // Create a new tab with the given method and url
      const newTab = {
        ...prevTabs[0],
        id: uuidv4(),
        method: method.toUpperCase(),
        url,
        tabName: url,
        isLoading: false,
        responseStatus: null,
        responseStatusText: '',
        responseHeaders: [],
        responseBody: '',
        responseTime: null,
        responseSize: null,
        responseError: null,
      };
      setActiveTabId(newTab.id);
      return [...prevTabs, newTab];
    });
  }, [setTabs, setActiveTabId]);

  // Function to validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      // Basic URL validation - checks if it starts with http:// or https://
      // and has a valid domain
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i.test(urlString);
    } catch (err) {
      return false;
    }
  };

  const handleSend = async (requestData: { method: string; url: string }) => {
    if (!activeTabObj) {
      toast.error('No active tab', { position: 'top-right' });
      return;
    }
    
    const method = requestData.method || 'GET';
    const url = (requestData.url || '').trim();
    
    // Validate URL
    if (!url) {
      toast.error('URL is required', { position: 'top-right' });
      return;
    }
    
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL (must start with http:// or https://)', { position: 'top-right' });
      return;
    }
    
    // Generate new request stats only if URL is valid
    const newStats = generateRequestStats();
    setRequestStats(newStats);
    
    try {
      
      // Update tab with new request data
      setTabs(tabs => tabs.map(tab => 
        tab.id === activeTabObj.id 
          ? { 
              ...tab, 
              method,
              url,
              isDirty: false,
              updatedAt: new Date().toISOString()
            } 
          : tab
      ));
      
      // Save to history and refresh
      const now = new Date();
      const historyData = {
        method,
        url,
        month: String(now.getMonth() + 1).padStart(2, '0'),
        day: String(now.getDate()).padStart(2, '0'),
        year: String(now.getFullYear()),
        time: now.toTimeString().slice(0, 8),
        is_favorite: false,
      };
      
      await saveRequest(historyData);
      await refreshHistory();
    } catch (error) {
      console.error('Error in handleSend:', error);
      setTabs(tabs => tabs.map(tab => 
        tab.id === activeTabObj.id 
          ? { ...tab, isDirty: false } 
          : tab
      ));
    }
  };

  return (
    <HistoryToTabsContext.Provider value={openTabFromHistory}>
      <div className={`flex flex-col h-full w-full ${themeClass} bg-bg text-text`}>
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <RestSplitPane right={<RestRightPanel />}>
          <div className="flex flex-col h-full w-full overflow-hidden">
            <RestTabsHeader
              tabs={tabs}
              activeTabId={activeTabId}
              onSwitchTab={switchTab}
              onAddTab={addTab}
              onCloseTab={id => {
                setTabs(newTabs => {
                  const idx = newTabs.findIndex(tab => tab.id === id);
                  if (idx !== -1) {
                    newTabs.splice(idx, 1);
                    setActiveTabId(newTabs[Math.max(0, idx - 1)]?.id || '');
                  }
                  return newTabs;
                });
              }}
              canClose={tabs.length > 1}
              methodColors={HTTP_METHOD_COLORS}
              envDropdownOpen={false}
              setEnvDropdownOpen={() => {}}
              showVarsPopover={false}
              setShowVarsPopover={() => {}}
              eyeRef={{ current: document.createElement('div') }}
              envTab="personal"
              setEnvTab={() => {}}
            />
            <div className="h-16">
              <RequestEditorContainer
                tab={activeTabObj}
                updateTab={(id, changes) => setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, ...changes } : tab))}
                onSend={handleSend}
              />
            </div>
            {/* Tabs - Fixed header */}
            <div className="sticky top-0 z-10 bg-bg border-b border-neutral-800 w-full">
              <div className="flex items-center gap-2 text-[14px] px-4 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap w-full">
                {['parameters', 'body', 'headers', 'authorization', 'pre-request', 'post-request', 'variables'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-3 py-1.5 rounded-md transition-colors ${
                      activeTabObj.activeTab === tab ? 'text-accent' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    {activeTabObj.activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            {/* Main content area with resizable panels */}
            <div className="flex-1 overflow-hidden">
              <PanelGroup direction="vertical">
                {/* Main content panel */}
                <Panel defaultSize={70} minSize={25} className="overflow-hidden">
                  <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabContentArea
                      activeTab={activeTabObj.activeTab}
                      // Parameters tab props
                      queryParams={queryParams}
                      handleParamChange={handleParamChange}
                      handleDeleteParam={handleDeleteParam}
                      handleDeleteAllParams={handleDeleteAllParams}
                      handleAddParam={handleAddParam}
                      handleDragEnd={handleDragEnd}
                      SortableParamRow={SortableParamRow}
                      // Body tab props
                      contentType={contentType}
                      contentTypeOptions={contentTypeOptions}
                      setContentType={setContentType}
                      dropdownOpen={dropdownOpen}
                      setDropdownOpen={setDropdownOpen}
                      hideScrollbarStyle={{}}
                      setActiveTab={setActiveTab}
                      rawBody={rawBody}
                      setRawBody={setRawBody}
                      // Headers tab props
                      headers={activeTabObj.headers || []}
                      handleHeaderChange={handleHeaderChange}
                      uuidv4={uuidv4}
                      setTabs={() => {}}
                      activeTabId={activeTabObj.id}
                      tabs={[]}
                      handleDeleteHeader={handleDeleteHeader}
                      handleAddHeader={handleAddHeader}
                      editHeadersActive={false}
                      setEditHeadersActive={() => {}}
                      SortableHeaderRow={SortableHeaderRow}
                      // Authorization tab props
                      authorization={activeTabObj.authorization || { type: 'no-auth' }}
                      setAuthorization={setAuthorization}
                      // Pre-request tab props
                      preRequestScript={preRequestScript}
                      setPreRequestScript={setPreRequestScript}
                      insertPreRequestSnippet={insertPreRequestSnippet}
                      highlightPreRequestScript={highlightPreRequestScript}
                      preRequestDivRef={preRequestDivRef}
                      // Post-request tab props
                      postRequestScript={postRequestScript}
                      setPostRequestScript={setPostRequestScript}
                      insertPostRequestSnippet={insertPostRequestSnippet}
                      highlightPostRequestScript={highlightPostRequestScript}
                      postRequestDivRef={postRequestDivRef}
                      // Variables tab props
                      variables={variables}
                      handleVariableChange={handleVariableChange}
                      handleDeleteVariable={handleDeleteVariable}
                      handleVariableDragEnd={handleVariableDragEnd}
                      SortableVariableRow={SortableVariableRow}
                    />
                  </div>
                </Panel>

                {/* Resize handle */}
                <PanelResizeHandle className="h-1.5 w-full cursor-row-resize bg-transparent hover:bg-blue-400/30 transition-colors" />

                {/* Bottom panel */}
                <Panel defaultSize={30} minSize={10} maxSize={75} className="flex flex-col bg-bg">
                  <BottomPanel 
                    requestTime={requestStats.time}
                    responseSize={requestStats.size}
                    statusCode={requestStats.statusCode}
                    statusText={requestStats.statusText}
                  />
                </Panel>
              </PanelGroup>
            </div>
          </div>
        </RestSplitPane>
      </div>
    </div>
    </HistoryToTabsContext.Provider>
  );
};

export default HoppscotchClone;
