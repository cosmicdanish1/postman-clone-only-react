// File: RequestEditorContainer.tsx
// Type: Container Component
// Imports: React, RequestEditor, hooks
// Imported by: RestPage.tsx
// Role: Connects RequestEditor to Redux store
// Located at: src/pages/Rest/RequestEditorContainer.tsx

import React, { useState, useRef, useEffect } from 'react';
import RequestEditor from './RequestEditor';
import { 
  useActiveTab, 
  useTabActions, 
  useRequestActions 
} from '../../features/restHooks';
import { useRequestHistory } from '../../features/useRequestHistory';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';
import { METHODS } from '../../constants/httpMethods';

const methodColors: Record<string, string> = {
  GET: '#10B981',      // green-500
  POST: '#3B82F6',     // blue-500
  PUT: '#F59E0B',      // yellow-500
  PATCH: '#8B5CF6',    // purple-500
  DELETE: '#EF4444',   // red-500
  HEAD: '#EC4899',     // pink-500
  OPTIONS: '#6366F1',  // indigo-500
  // Add more methods as needed
};

const RequestEditorContainer: React.FC = () => {
  const activeTab = useActiveTab();
  const tabActions = useTabActions();
  const requestActions = useRequestActions();
  
  // Ensure there's always an active tab
  useEffect(() => {
    if (!activeTab) {
      console.log('No active tab found, creating a new one...');
      tabActions.addTab({
        id: `tab-${Date.now()}`,
        name: 'New Request',
        method: 'GET',
        url: 'https://echo.hoppscotch.io',
        headers: [],
        parameters: [],
        body: {
          raw: '',
          formData: [],
          urlEncoded: [],
          binary: '',
          graphQL: {
            query: '',
            variables: '{}'
          }
        },
        auth: { type: 'none' },
        response: {
          status: 0,
          statusText: '',
          headers: {},
          data: null,
          time: 0,
          size: 0
        },
        isSaving: false,
        isDirty: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      console.log('Active tab:', activeTab.id, 'Method:', activeTab.method);
    }
  }, [activeTab]);

  const { themeClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  // Refs for dropdowns
  const methodDropdownRef = useRef<HTMLDivElement | null>(null);
  const sendMenuRef = useRef<HTMLDivElement | null>(null);
  const saveDropdownRef = useRef<HTMLDivElement | null>(null);

  // Local UI state
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [saveRequestName, setSaveRequestName] = useState('');
  
  // Create a default tab if none exists
  const defaultTab = {
    id: 'default-tab',
    method: 'GET',
    url: 'https://echo.hoppscotch.io',
    name: 'New Request',
    description: '',
    headers: [],
    queryParams: [],
    body: {
      mode: 'none',
      raw: '',
      formData: [],
      urlEncoded: [],
      binary: '',
      graphQL: {
        query: '',
        variables: '{}',
      },
    },
    auth: { type: 'none' },
    isDirty: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Use activeTab or defaultTab if activeTab is null
  const currentTab = activeTab || defaultTab;

  // Handle method change
  const handleMethodChange = (newMethod: string) => {
    console.log('Updating method to:', newMethod);
    if (activeTab) {
      // Update the tab with the new method
      tabActions.updateTab(activeTab.id, { 
        method: newMethod,
        isDirty: true,
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Handle URL change
  const handleUrlChange = (url: string) => {
    requestActions.updateUrl(url);
    if (activeTab) {
      tabActions.updateTab(activeTab.id, { 
        url,
        isDirty: true 
      });
    }
  };

  // Get the saveRequest function from useRequestHistory hook
  const { saveRequest } = useRequestHistory();

  // Handle send request
  const handleSend = async (requestData: { method: string; url: string }) => {
    console.log('=== handleSend called with:', requestData);
    
    if (!activeTab) {
      console.error('No active tab');
      return;
    }
    
    try {
      const method = requestData.method || 'GET';
      const url = (requestData.url || '').trim();
      
      if (!url) {
        console.error('URL is required');
        return;
      }
      
      console.log('Updating tab with method:', method, 'and URL:', url);
      
      // Update the tab with the latest URL and method first
      tabActions.updateTab(activeTab.id, { 
        method,
        url,
        isDirty: false 
      });
      
      // Save the request to history
      const now = new Date();
      const historyData = {
        method,
        url,
        month: String(now.getMonth() + 1).padStart(2, '0'),
        day: String(now.getDate()).padStart(2, '0'),
        year: String(now.getFullYear()),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      
      console.log('Saving request to history:', historyData);
      console.log('Calling saveRequest with:', historyData);

      const saveResult = await saveRequest(historyData);
      console.log('saveResult:', saveResult);
      
      if (!saveResult.success) {
        console.error('Failed to save request to history:', saveResult.error);
        // Continue with the request even if saving to history fails
      } else {
        console.log('Successfully saved request to history');
      }
      
      // Send the actual request
      requestActions.sendRequest();
      
    } catch (error) {
      console.error('Error in handleSend:', error);
      // Still try to send the request even if history save fails
      requestActions.sendRequest();
      tabActions.updateTab(activeTab.id, { isDirty: false });
    }
  };

  // Handle save request
  const handleSave = () => {
    if (saveRequestName.trim() && activeTab) {
      tabActions.updateTab(activeTab.id, { 
        name: saveRequestName.trim(),
        isDirty: false 
      });
      setSaveRequestName('');
      setShowSaveDropdown(false);
    }
  };

  // Handle generate code
  const handleGenerateCode = () => {
    // TODO: Implement code generation logic
    console.log('Generating code for request');
  };

  // Prepare props for RequestEditor
  const requestEditorProps = {
    METHODS: [...METHODS],
    method: currentTab.method,
    setMethod: handleMethodChange,
    methodDropdownOpen,
    setMethodDropdownOpen,
    methodDropdownRef,
    methodColors,
    url: currentTab.url,
    setUrl: handleUrlChange,
    onSend: handleSend,
    onSendMenuOpen: () => setSendMenuOpen(!sendMenuOpen),
    sendMenuOpen,
    sendMenuRef,
    onShowImportCurlModal: () => {
      // TODO: Show import curl modal and handle the imported curl
      console.log('Showing import curl modal');
    },
    onShowGenerateCodeModal: handleGenerateCode,
    onShowSaveModal: () => {},
    onShowSaveDropdown: () => setShowSaveDropdown(!showSaveDropdown),
    showSaveDropdown,
    saveDropdownRef,
    saveRequestName,
    onSaveRequestNameChange: setSaveRequestName,
    onSave: handleSave,
    themeClass,
    accentColor,
    // Add border and text classes based on theme
    borderClass: themeClass === 'dark' ? 'border-gray-700' : 'border-gray-200',
    textClass: themeClass === 'dark' ? 'text-white' : 'text-gray-800',
    buttonBgClass: themeClass === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100',
  };

  return <RequestEditor {...requestEditorProps} />;
};

export default RequestEditorContainer;
