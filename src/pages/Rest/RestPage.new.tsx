import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { useRestTabs } from '../../hooks/useRestTabs';
import RestTabsHeader from './components/RestTabsHeader';
import TabContentArea from './TabContentArea/TabContentArea';
import ResizableRightPanel from '../../components/ResizableRightPanel';
import { uuidv4 } from '../../utils/helpers';
import type { Parameter, Variable, AuthType } from '../../types';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { arrayMove } from '@dnd-kit/sortable';
import type { DndContextProps, DragEndEvent } from '@dnd-kit/core';

// Dummy sortable components - implement these properly later
const SortableParamRow: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const SortableHeaderRow: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const SortableVariableRow: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

interface TabType {
  id: string;
  method: string;
  url: string;
  name: string;
}

const HoppscotchClone: FC = () => {
  // State for UI
  const [rightPanelWidth, setRightPanelWidth] = useState(380);
  const [activeTab, setActiveTab] = useState('params');
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [showVarsPopover, setShowVarsPopover] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; type: string }>({ open: false, type: '' });
  
  // Refs
  const eyeRef = useRef<HTMLButtonElement>(null);
  const methodDropdownRef = useRef<HTMLDivElement>(null);
  const sendMenuRef = useRef<HTMLDivElement>(null);
  const saveDropdownRef = useRef<HTMLDivElement>(null);
  
  // Request data state
  const [queryParams, setQueryParams] = useState<Parameter[]>([]);
  const [headers, setHeaders] = useState<Parameter[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [body, setBody] = useState('');
  const [rawBody, setRawBody] = useState('');
  const [contentType, setContentType] = useState('application/json');
  const [authType, setAuthType] = useState<AuthType>('none');
  const [authValue, setAuthValue] = useState('');
  const [preRequestScript, setPreRequestScript] = useState('');
  const [postRequestScript, setPostRequestScript] = useState('');
  
  // UI state
  const [editHeadersActive, setEditHeadersActive] = useState(false);
  const [isPreRequestScriptOpen, setIsPreRequestScriptOpen] = useState(false);
  const [isPostRequestScriptOpen, setIsPostRequestScriptOpen] = useState(false);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  // Use the rest tabs hook
  const { 
    tabs = [], 
    activeTabId, 
    setMethod, 
    setUrl,
    switchTab: handleSwitchTab,
    addTab: handleAddTab,
    setActiveTabId: handleSetActiveTabId,
    setTabs: handleSetTabs
  } = useRestTabs();
  
  // Get active tab data
  const activeTabObj = useMemo(() => 
    tabs.find(tab => tab.id === activeTabId) || null, 
    [tabs, activeTabId]
  );

  // Method colors for UI
  const methodColors = useMemo(() => ({
    GET: '#10B981',
    POST: '#3B82F6',
    PUT: '#F59E0B',
    PATCH: '#8B5CF6',
    DELETE: '#EF4444',
    HEAD: '#6B7280',
    OPTIONS: '#6B7280',
    CONNECT: '#737373',
    TRACE: '#737373',
    CUSTOM: '#737373',
  }), []);

  // Handle parameter changes
  const handleAddParam = useCallback(() => {
    setQueryParams(prev => [...prev, { id: uuidv4(), key: '', value: '', description: '' }]);
  }, []);

  const handleDeleteParam = useCallback((id: string) => {
    setQueryParams(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleParamChange = useCallback((id: string, field: keyof Parameter, value: string) => {
    setQueryParams(prev => 
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  }, []);

  // Handle header changes
  const handleAddHeader = useCallback(() => {
    setHeaders(prev => [...prev, { id: uuidv4(), key: '', value: '', description: '' }]);
  }, []);

  const handleDeleteHeader = useCallback((id: string) => {
    setHeaders(prev => prev.filter(h => h.id !== id));
  }, []);

  const handleHeaderChange = useCallback((id: string, field: keyof Parameter, value: string) => {
    setHeaders(prev => 
      prev.map(h => h.id === id ? { ...h, [field]: value } : h)
    );
  }, []);

  // Handle variable changes
  const handleAddVariable = useCallback(() => {
    setVariables(prev => [...prev, { id: uuidv4(), key: '', value: '' }]);
  }, []);

  const handleDeleteVariable = useCallback((id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  }, []);

  const handleVariableChange = useCallback((id: string, field: keyof Variable, value: string) => {
    setVariables(prev => 
      prev.map(v => v.id === id ? { ...v, [field]: value } : v)
    );
  }, []);

  // Handle drag and drop
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setQueryParams((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Handle body changes
  const handleBodyChange = useCallback((newBody: string) => {
    setBody(newBody);
    setRawBody(newBody);
  }, []);

  // Handle auth changes
  const handleAuthTypeChange = useCallback((newAuthType: AuthType) => {
    setAuthType(newAuthType);
  }, []);

  const handleAuthValueChange = useCallback((newAuthValue: string) => {
    setAuthValue(newAuthValue);
  }, []);

  // Handle content type changes
  const handleContentTypeChange = useCallback((newContentType: string) => {
    setContentType(newContentType);
  }, []);

  // Handle edit headers
  const handleEditHeaders = useCallback(() => {
    setEditHeadersActive(!editHeadersActive);
  }, [editHeadersActive]);

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setEditModal({ open: false, type: '' });
  }, []);

  // Use outside click for popovers
  useOutsideClick(eyeRef, () => setShowVarsPopover(false));
  useOutsideClick(methodDropdownRef, () => setMethodDropdownOpen(false));
  useOutsideClick(sendMenuRef, () => setSendMenuOpen(false));
  useOutsideClick(saveDropdownRef, () => setShowSaveDropdown(false));

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <RestTabsHeader 
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitchTab={handleSwitchTab}
          onAddTab={handleAddTab}
          onCloseTab={(id) => {
            // Handle tab close
            const newTabs = tabs.filter(tab => tab.id !== id);
            handleSetTabs(newTabs);
            if (activeTabId === id && newTabs.length > 0) {
              handleSetActiveTabId(newTabs[0].id);
            }
          }}
          onMethodChange={setMethod}
          onUrlChange={setUrl}
          onSend={() => {}}
          onSave={() => {}}
          onMoreActions={() => {}}
        />
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Request panel */}
        <div 
          className="flex-1 flex flex-col overflow-hidden"
          style={{ marginRight: rightPanelWidth }}
        >
          <div className="flex-1 overflow-auto p-4">
            <TabContentArea
              activeTab={activeTab}
              onTabChange={setActiveTab}
              queryParams={queryParams}
              onAddParam={handleAddParam}
              onDeleteParam={handleDeleteParam}
              onParamChange={handleParamChange}
              headers={headers}
              onAddHeader={handleAddHeader}
              onDeleteHeader={handleDeleteHeader}
              onHeaderChange={handleHeaderChange}
              variables={variables}
              onAddVariable={handleAddVariable}
              onDeleteVariable={handleDeleteVariable}
              onVariableChange={handleVariableChange}
              body={body}
              onBodyChange={handleBodyChange}
              authType={authType}
              onAuthTypeChange={handleAuthTypeChange}
              authValue={authValue}
              onAuthValueChange={handleAuthValueChange}
              preRequestScript={preRequestScript}
              onPreRequestScriptChange={setPreRequestScript}
              postRequestScript={postRequestScript}
              onPostRequestScriptChange={setPostRequestScript}
              sortableParamRow={SortableParamRow}
              sortableHeaderRow={SortableHeaderRow}
              sortableVariableRow={SortableVariableRow}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>

        {/* Right panel */}
        <ResizableRightPanel
          width={rightPanelWidth}
          minWidth={300}
          onResize={setRightPanelWidth}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-medium text-gray-700 dark:text-gray-200">Response</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-gray-500 dark:text-gray-400">
                Send a request to see the response here
              </p>
            </div>
          </div>
        </ResizableRightPanel>
      </main>

      {/* Bottom actions removed */}

      {/* Modals */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editModal.type === 'save' ? 'Save Request' : 'Edit Request'}
            </h3>
            {/* Add form fields here */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Handle save/update
                  handleCloseModal();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {editModal.type === 'save' ? 'Save' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoppscotchClone;
