// File: RequestEditor.tsx
// Type: Component (request editor)
// Imports: React, various tab components
// Imported by: RestPage.tsx
// Role: Renders the main request editor UI for the REST feature.

import React from 'react';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

interface RequestEditorProps {
  METHODS: string[];
  method: string;
  setMethod: (method: string) => void;
  methodDropdownOpen: boolean;
  setMethodDropdownOpen: (open: boolean) => void;
  methodDropdownRef: React.RefObject<HTMLDivElement>;
  methodColors: Record<string, string>;
  url: string;
  setUrl: (url: string) => void;
  onSend: () => void;
  onSendMenuOpen: () => void;
  sendMenuOpen: boolean;
  sendMenuRef: React.RefObject<HTMLDivElement>;
  onShowImportCurlModal: () => void;
  onShowGenerateCodeModal: () => void;
  onShowSaveModal: () => void;
  onShowSaveDropdown: () => void;
  showSaveDropdown: boolean;
  saveDropdownRef: React.RefObject<HTMLDivElement>;
  saveRequestName: string;
}

const RequestEditor: React.FC<RequestEditorProps> = (props) => {
  // Using the theme and accent color hooks
  const { themeClass, textClass, borderClass, buttonBgClass, borderRightClass, borderLeftClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  const DEFAULT_URL = 'https://echo.hoppscotch.io';
  
  const {
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
    saveRequestName,
  } = props;

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
              onSend();
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
            onClick={onSend}
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
