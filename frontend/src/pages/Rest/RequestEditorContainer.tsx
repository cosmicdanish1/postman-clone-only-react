// File: RequestEditorContainer.tsx
// Type: Container Component
// Imports: React, RequestEditor, hooks
// Imported by: RestPage.tsx
// Role: Connects RequestEditor to Redux store
// Located at: src/pages/Rest/RequestEditorContainer.tsx

import React, { useState, useRef } from 'react';
import RequestEditor from './RequestEditor';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';
import { METHODS } from '../../constants/httpMethods';
import HTTP_METHOD_COLORS from '../../constants/httpMethodColors';



interface RequestEditorContainerProps {
  tab: any;
  updateTab: (id: string, changes: Partial<any>) => void;
}

const RequestEditorContainer: React.FC<RequestEditorContainerProps> = ({ tab, updateTab }) => {
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
  


  // Use tab prop directly
  const currentTab = tab;

  // Handle method change
  const handleMethodChange = (newMethod: string) => {
    console.log('Updating method to:', newMethod);
    if (tab) {
      updateTab(tab.id, {
        method: newMethod,
        isDirty: true,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Handle URL change
  const handleUrlChange = (url: string) => {
    if (tab) {
      updateTab(tab.id, {
        url,
        isDirty: true,
        updatedAt: new Date().toISOString(),
      });
    }
  };



  // Handle send request
  const handleSend = async (requestData: { method: string; url: string }) => {
    console.log('=== handleSend called with:', requestData);
    if (!tab) {
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
      updateTab(tab.id, {
        method,
        url,
        isDirty: false,
        updatedAt: new Date().toISOString(),
      });
      // Optionally: trigger send logic here if needed
    } catch (error) {
      console.error('Error in handleSend:', error);
      updateTab(tab.id, { isDirty: false });
      // Optionally show error to user here
    }
  };

  // Handle save request
  const handleSave = () => {
    if (saveRequestName.trim() && tab) {
      updateTab(tab.id, {
        name: saveRequestName.trim(),
        isDirty: false,
        updatedAt: new Date().toISOString(),
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
    methodColors: HTTP_METHOD_COLORS,
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
