// File: RequestEditor.tsx
// Type: Component (request editor)
// Imports: React, various tab components
// Imported by: RequestEditorContainer.tsx
// Role: Renders the main request editor UI for the REST feature.

import React, { useState, useEffect, useRef } from 'react';
import useThemeClass from '../../hooks/useThemeClass';
import { executeRequest, saveToHistory } from '../../services/apiClient';

interface RequestEditorProps {
  METHODS: string[];
  method: string;
  setMethod: (method: string) => void;
  methodDropdownOpen: boolean;
  setMethodDropdownOpen: (open: boolean) => void;
  methodDropdownRef: React.RefObject<HTMLDivElement | null>;
  methodColors: Record<string, string>;
  url: string;
  setUrl: (url: string) => void;
  onSend: (response: any) => void;
  onSendMenuOpen: () => void;
  sendMenuOpen: boolean;
  sendMenuRef: React.RefObject<HTMLDivElement | null>;
  onShowImportCurlModal: () => void;
  onShowGenerateCodeModal: () => void;
  onShowSaveModal: () => void;
  onShowSaveDropdown: () => void;
  showSaveDropdown: boolean;
  saveDropdownRef: React.RefObject<HTMLDivElement | null>;
  saveRequestName: string;
  onSaveRequestNameChange: (name: string) => void;
  onSave: () => void;
  themeClass: string;
  accentColor: string;
}

const DEFAULT_URL = 'https://jsonplaceholder.typicode.com/posts/1';

const RequestEditor: React.FC<RequestEditorProps> = ({
  METHODS,
  method,
  setMethod,
  methodDropdownOpen,
  setMethodDropdownOpen,
  methodDropdownRef,
  methodColors,
  url = '',
  setUrl,
  onSend,
  onSendMenuOpen,
  sendMenuOpen,
  sendMenuRef,
  onShowImportCurlModal,
  onShowGenerateCodeModal,
  onShowSaveModal,
  onShowSaveDropdown,
  showSaveDropdown,
  saveDropdownRef,
  saveRequestName = '',
  onSaveRequestNameChange = () => {},
  onSave = () => {},
  themeClass = '',
  accentColor = '',
}) => {
  const [localUrl, setLocalUrl] = useState(url || DEFAULT_URL);
  const [isSending, setIsSending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUrl(e.target.value);
    setRequestError(null);
  };

  // Handle Enter key press in URL input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Handle sending the request
  const handleSend = async () => {
    if (!localUrl) {
      setRequestError('Please enter a URL');
      return;
    }
    
    setIsSending(true);
    setRequestError(null);
    
    try {
      const targetUrl = localUrl || DEFAULT_URL;
      setUrl(targetUrl);
      
      const startTime = Date.now();
      const response = await executeRequest({
        method: method as any,
        url: targetUrl,
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Save to history if successful
      if (response.success) {
        await saveToHistory({
          method,
          url: targetUrl,
          status: response.status || 200,
          statusText: response.statusText || 'OK',
          responseTime,
        });
      }
      
      // Call the parent's onSend with the response
      onSend(response);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send request';
      setRequestError(errorMessage);
      console.error('Request failed:', error);
      
      // Still call onSend with error state
      onSend({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(event.target as Node)) {
        setMethodDropdownOpen(false);
      }
      if (sendMenuRef.current && !sendMenuRef.current.contains(event.target as Node)) {
        // onSendMenuOpen is handled by the parent
      }
      if (saveDropdownRef.current && !saveDropdownRef.current.contains(event.target as Node)) {
        // onShowSaveDropdown is handled by the parent
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [methodDropdownRef, sendMenuRef, saveDropdownRef]);

  // Update local URL when prop changes
  useEffect(() => {
    if (url !== localUrl) {
      setLocalUrl(url);
    }
  }, [url]);

  // Set mounted flag to prevent SSR issues with theme class
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Theme classes
  const borderClass = themeClass === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textClass = themeClass === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBgClass = themeClass === 'dark' ? 'bg-gray-800' : 'bg-white';
  const buttonBgClass = themeClass === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50';

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        {/* Method Dropdown */}
        <div className="relative" ref={methodDropdownRef}>
          <button
            type="button"
            className={`flex items-center justify-between w-24 px-3 py-2 text-sm font-medium rounded-l-md border ${borderClass} ${methodColors[method] || 'bg-gray-100 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}`}
            onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
          >
            <span className="flex-1 text-left">{method}</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {methodDropdownOpen && (
            <div className={`absolute z-10 w-full mt-1 origin-top-right rounded-md shadow-lg ${cardBgClass} ring-1 ring-black ring-opacity-5 focus:outline-none`}>
              <div className="py-1">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-${methodColors[m].replace('bg-', '')} ${method === m ? 'font-semibold' : ''}`}
                    style={{ color: methodColors[m] }}
                    onClick={() => {
                      setMethod(m);
                      setMethodDropdownOpen(false);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="flex-1 flex">
          <input
            type="text"
            className={`flex-1 min-w-0 px-3 py-2 text-sm border-t border-b border-r-0 border-l-0 ${borderClass} focus:ring-2 focus:ring-${accentColor} focus:border-transparent focus:outline-none ${textClass} ${cardBgClass}`}
            placeholder="Enter request URL"
            value={localUrl}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send Button */}
        <div className="relative flex items-stretch" ref={sendMenuRef}>
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium text-white rounded-l-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSending ? 'opacity-70 cursor-wait' : ''}`}
            style={{
              backgroundColor: accentColor,
              '--accent-hover': `${accentColor}e6`,
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}e6`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
            }}
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
          <button
            disabled={isSending}
            className={`px-2 py-2 rounded-r-md font-semibold text-white transition-colors duration-200 ${sendMenuOpen ? 'bg-opacity-90' : ''} ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{
              backgroundColor: accentColor,
              '--accent-hover': `${accentColor}e6`,
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}e6`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
            }}
            onClick={onSendMenuOpen}
            aria-label="Send options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {sendMenuOpen && (
            <div
              ref={sendMenuRef}
              className={`absolute right-0 mt-2 w-56 rounded-xl z-50 p-2 ${themeClass === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
              style={{
                top: '100%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <button
                className={`flex items-center w-full px-3 py-2 rounded gap-3 transition-colors duration-200 ${themeClass === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                style={{
                  color: themeClass === 'dark' ? '#fff' : '#1f2937'
                }}
                onClick={onShowImportCurlModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                <span className="flex-1 text-left">Import cURL</span>
                <span className={`text-xs px-2 py-0.5 rounded ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>C</span>
              </button>
              <button
                className={`flex items-center w-full px-3 py-2 rounded gap-3 transition-colors duration-200 ${themeClass === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                style={{
                  color: themeClass === 'dark' ? '#fff' : '#1f2937'
                }}
                onClick={onShowGenerateCodeModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
                <span className="flex-1 text-left">Show code</span>
                <span className={`text-xs px-2 py-0.5 rounded ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>S</span>
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 rounded gap-3 transition-colors duration-200 ${themeClass === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                style={{
                  color: themeClass === 'dark' ? '#fff' : '#1f2937'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
                <span className="flex-1 text-left">Clear all</span>
                <span className={`text-xs px-2 py-0.5 rounded ${themeClass === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>⌫</span>
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="relative flex items-stretch" ref={saveDropdownRef}>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${textClass} ${buttonBgClass} border ${borderClass} rounded-md hover:bg-opacity-90 transition-colors duration-200`}
            onClick={onShowSaveDropdown}
          >
            Save
          </button>
          {showSaveDropdown && (
            <div className={`absolute right-0 z-10 w-64 mt-1 ${cardBgClass} rounded-md shadow-lg border ${borderClass}`}>
              <div className="p-4">
                <input
                  type="text"
                  className={`w-full px-3 py-2 text-sm ${textClass} ${cardBgClass} border ${borderClass} rounded focus:outline-none focus:ring-2 focus:ring-${accentColor}`}
                  placeholder="Request Name"
                  value={saveRequestName}
                  onChange={(e) => onSaveRequestNameChange(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => onShowSaveDropdown()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 ml-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                    onClick={onSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {requestError && (
        <div className="mt-2 px-3 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          {requestError}
        </div>
      )}
    </div>
  );
};

export default RequestEditor;
