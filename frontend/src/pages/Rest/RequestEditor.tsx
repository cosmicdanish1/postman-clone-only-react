// File: RequestEditor.tsx
// Type: Component (request editor)
// Imports: React, various tab components
// Imported by: RequestEditorContainer.tsx
// Role: Renders the main request editor UI for the REST feature.

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';
import { isValidUrl } from '../../utils/timeUtils';

interface RequestData {
  method: string;
  url: string;
}

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
  onSend: (data: RequestData) => void;
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

const RequestEditor: React.FC<RequestEditorProps> = ({
  METHODS,
  method,
  setMethod,
  methodDropdownOpen,
  setMethodDropdownOpen,
  methodDropdownRef,
  methodColors,
  url,
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
  onSave,
  themeClass = '',
  accentColor = '',
}) => {
  const DEFAULT_URL = 'https://echo.hoppscotch.io';
  
  // Get theme classes from useThemeClass hook
  const { 
    themeClass: themeClassFromHook, 
    buttonBgClass, 
    borderClass, 
    borderRightClass, 
    borderLeftClass,
    textClass,
    cardBgClass
  } = useThemeClass();
  
  // Use themeClass from props if available, otherwise use from hook
  const effectiveThemeClass = themeClass || themeClassFromHook;
  
  // Local state to track the current method
  const [currentMethod, setCurrentMethod] = React.useState(method || 'GET');
  
  // Update local state when prop changes
  React.useEffect(() => {
    if (method && method !== currentMethod) {
      setCurrentMethod(method);
    }
  }, [method]);

  const handleMethodSelect = (selectedMethod: string) => {
    console.log('Selected method:', selectedMethod);
    // Update local state immediately for better UX
    setCurrentMethod(selectedMethod);
    // Call the prop to update Redux
    if (setMethod) {
      setMethod(selectedMethod);
    }
    // Close the dropdown
    setMethodDropdownOpen(false);
  };

  const [localUrl, setLocalUrl] = React.useState(url || DEFAULT_URL);
  const { t } = useTranslation();
  const [sendError, setSendError] = useState<string>('');
  
  // Handle send button click
  const handleSendButtonClick = useCallback(() => {
    const trimmedUrl = localUrl.trim();
    
    // Validate URL before sending
    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      setSendError(t('request_editor.url_validation_error'));
      // Show error popup
      setTimeout(() => {
        setSendError('');
      }, 3000); // Clear error after 3 seconds
      return;
    }
    
    setUrl(trimmedUrl);
    setSendError(''); // Clear any previous error
    
    const requestData = {
      method: currentMethod,
      url: trimmedUrl,
    };
    
    console.log('=== FRONTEND: Sending request ===');
    console.log('Data being sent:', JSON.stringify(requestData, null, 2));
    console.log('Endpoint:', '/api/history');
    
    // Log the full fetch call for debugging
    console.log('Fetch call details:', {
      url: 'http://localhost:5000/api/history',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    
    onSend(requestData);
  }, [onSend, currentMethod, localUrl, setUrl]);



  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(event.target as Node)) {
        setMethodDropdownOpen(false);
      }
    };

    if (methodDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [methodDropdownOpen]);

  // Update local URL when prop changes
  React.useEffect(() => {
    setLocalUrl(url || DEFAULT_URL);
  }, [url]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLocalUrl(newUrl);
    // No real-time validation
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendButtonClick();
    }
  }, [handleSendButtonClick]);

  // Custom scrollbar styles
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `${accentColor}80`,
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: accentColor,
    },
    scrollbarWidth: 'thin' as const,
    scrollbarColor: `${accentColor}80 transparent`,
  };

  return (
    <div className={`flex flex-col h-full ${effectiveThemeClass}`}>
      <div className={`flex items-stretch w-full gap-2`}>
        {/* Error Popup */}
        {sendError && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <p className="text-sm">{sendError}</p>
          </div>
        )}
        
        {/* Method Dropdown */}
        <div className="shrink-0 flex items-stretch" ref={methodDropdownRef}>
          <div className="relative">
            <button
              type="button"
              className={`h-full flex items-center justify-between w-24 px-3 py-2 text-sm font-medium rounded-l-md ${buttonBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor} transition-colors`}
              onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
              aria-expanded={methodDropdownOpen}
              aria-haspopup="listbox"
              disabled={!!sendError}
              style={{ color: methodColors[currentMethod] || 'inherit' }}
            >
              <span className="flex-1 text-left font-medium">
                {currentMethod}
              </span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {methodDropdownOpen && (
              <div 
                className={`absolute left-0 z-50 w-32 mt-1 origin-top-left ${cardBgClass} rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                <div 
                  className="py-1 max-h-60 overflow-y-auto" 
                  style={scrollbarStyles}
                  role="none"
                >
                  {METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`block w-full px-4 py-2 text-sm text-left ${
                        m === currentMethod 
                          ? 'bg-opacity-20 bg-gray-500' 
                          : 'hover:bg-opacity-10 hover:bg-gray-500'
                      } focus:outline-none focus:bg-opacity-10 focus:bg-gray-500`}
                      style={{ color: methodColors[m] || 'inherit' }}
                      onClick={() => handleMethodSelect(m)}
                      role="menuitem"
                      tabIndex={-1}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* URL Input */}
        <div className="flex-1 grow min-w-0">
          <input
            type="text"
            value={localUrl}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
            placeholder={t('request_editor.url_placeholder')}
            className={`w-full px-3 py-2 text-sm ${textClass} transition-colors ${cardBgClass}`}
            aria-label="Request URL"
          />
        </div>

        {/* Send Button */}
        <div className="shrink-0 flex items-stretch" ref={sendMenuRef}>
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium rounded-l-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonBgClass}`}
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
            onClick={handleSendButtonClick}
          >
            {t('request_editor.buttons.send')}
          </button>
          <button
            type="button"
            className={`px-2 py-2 rounded-r-md font-semibold transition-colors duration-200 ${buttonBgClass} ${sendMenuOpen ? 'bg-opacity-90' : ''}`}
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
            aria-label={t('request_editor.buttons.send_options')}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 18 22 12 16 6"/><path d="M8 6 2 12l6 6"/></svg>
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
            className={`px-4 py-2 text-sm font-medium ${textClass} ${buttonBgClass} rounded-md hover:bg-opacity-90 transition-colors duration-200`}
            onClick={onShowSaveDropdown}
          >
            {t('request_editor.buttons.save')}
          </button>
          {showSaveDropdown && (
            <div className={`absolute right-0 z-10 w-64 mt-1 ${cardBgClass} rounded-md shadow-lg border ${borderClass}`}>
              <div className="p-4">
                <input
                  type="text"
                  className={`w-full px-3 py-2 text-sm ${textClass} ${cardBgClass} border ${borderClass} rounded focus:outline-none focus:ring-2 focus:ring-${accentColor}`}
                  placeholder={t('request_editor.save_modal.name_placeholder')}
                  value={saveRequestName}
                  onChange={(e) => onSaveRequestNameChange(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => onShowSaveDropdown()}
                  >
                    {t('request_editor.buttons.cancel')}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 ml-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                    onClick={onSave}
                  >
                    {t('request_editor.buttons.save')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // accentHex is already defined above

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-4 mt-2 gap-2 sm:gap-0">
      {/* Top row: Method + URL (always together) */}
      <div className="flex flex-row flex-1 items-center ">
        {/* Method Dropdown */}
        <div className="relative" ref={methodDropdownRef}>
          <button
            type="button"
            className={`${buttonBgClass} ${borderRightClass} font-bold px-2 py-1 h-9 rounded-l-sm  ml-1 border-r focus:outline-none flex items-center w-24 relative`}
            style={{ color: methodColors[method] || '#737373'}}
            onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
          >
            <span className="flex-1 text-left ">{method}</span>
            <span className="flex items-center justify-end" style={{ minWidth: 24 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </span>
          </button>
          {methodDropdownOpen && (
            <div
              className={`${themeClass}  ${textClass} ${borderClass} ${buttonBgClass} absolute left-0 mt-1 w-35 max-h-64 rounded-md shadow-lg z-50 overflow-y-auto scrollbar-hide`}
              style={{ top: '100%' }}
            >
              {METHODS.map(m => (
                <button
                  key={m}
                  className="w-full text-left px-4 py-2 font-bold hover:bg-[#232326] focus:outline-none"
                  style={{ color: methodColors[m] || '#737373', background: 'inherit' }}
                  onClick={() => {
                    setMethod(m);
                    setMethodDropdownOpen(false);
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* URL Input */}
        <input
          type="text"
          className={`${themeClass} ${buttonBgClass} flex-1 rounded-r-sm px-4 py-2 h-9 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={DEFAULT_URL}
          value={url}
          onChange={e => setUrl(e.target.value)}
          onBlur={e => {
            const value = e.target.value.trim();
            if (!value) {
              setUrl('');
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
              const targetUrl = url || DEFAULT_URL;
              onSend({
                method: method as any,
                url: targetUrl,
              });
            }
          }}
        />
      </div>
      {/* Button row: Send, Save, etc. (below input on mobile, inline on desktop) */}
      <div className="flex flex-row gap-2 ml-1 w-full sm:w-auto">
        {/* Send Buttons */}
        <div className="relative flex">
          <button
            className={`px-8 py-1 rounded-l-md  h-9 mt-[2px] font-semibold text-white transition-colors duration-200`}
            style={{
              backgroundColor: accentColor,
              borderColor: accentColor,
              '--accent-hover': `${accentColor}e6`,
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}e6`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
            }}
            onClick={() => {
              const targetUrl = localUrl || DEFAULT_URL;
              setUrl(targetUrl);
              onSend({
                method: method as any,
                url: targetUrl,
              });
            }}
          >
            Send
          </button>
          <button
            className={`px-2 py-2 rounded-r-md font-semibold h-9 mt-[2px] ${borderLeftClass} text-white transition-colors duration-200 ${borderClass}`}
            style={{
              backgroundColor: accentColor,
              borderColor: accentColor,
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
              className={`absolute left-0 mt-2 w-56 rounded-xl z-50 p-2 ${themeClass} ${buttonBgClass} ${borderClass}`}
              style={{
                top: '100%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <button
                className="flex items-center w-full px-3 py-2 rounded gap-3 transition-colors duration-200"
                style={{
                  color: 'var(--text-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={onShowImportCurlModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                <span className="flex-1 text-left">Import cURL</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--hover-bg-color)' }}>C</span>
              </button>
              <button
                className="flex items-center w-full px-3 py-2 rounded gap-3 transition-colors duration-200"
                style={{
                  color: 'var(--text-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={onShowGenerateCodeModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24" stroke="currentColor"><path d="M16 18 22 12 16 6"/><path d="M8 6 2 12l6 6"/></svg>
                <span className="flex-1 text-left">Show code</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--hover-bg-color)' }}>S</span>
              </button>
              <button 
                className="flex items-center w-full px-3 py-2 rounded gap-3 transition-colors duration-200"
                style={{
                  color: 'var(--text-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24" stroke="currentColor"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
                <span className="flex-1 text-left">Clear all</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--hover-bg-color)' }}>⌫</span>
              </button>
            </div>
          )}
        </div>
        {/* Save Button */}
        <button className={`  ${themeClass}  ${textClass}  ${buttonBgClass} flex px-4 py-2 rounded-l-md font-semibold h-10`} onClick={onShowSaveModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
          <span className="ml-2">Save</span>
        </button>
        {/* Save Dropdown */}
        <div className="relative inline-block">
          <button
            className={` ${textClass}  ${buttonBgClass} px-2 py-2 rounded-r-md font-semibold`}
            onClick={onShowSaveDropdown}
            aria-label="Save options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {showSaveDropdown && (
            <div
              ref={saveDropdownRef}
              className="absolute right-0 mt-2 w-56 bg-[#18181A] rounded-xl shadow-2xl border border-zinc-800 z-50 p-4"
              style={{ top: '100%' }}
            >
              <div className="mb-4">
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base font-semibold mb-2 text-center"
                  value={saveRequestName}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestEditor;

