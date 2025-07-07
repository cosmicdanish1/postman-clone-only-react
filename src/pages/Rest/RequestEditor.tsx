// File: RequestEditor.tsx
// Type: Component (request editor)
// Imports: React, various tab components
// Imported by: RestPage.tsx
// Role: Renders the main request editor UI for the REST feature.
// Located at: src/pages/Rest/RequestEditor.tsx
import React from 'react';

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
  saveRequestName,
}) => (
  <div className="flex items-center mb-4">
    <div className="relative" ref={methodDropdownRef}>
      <button
        type="button"
        className="font-bold px-2 py-1 h-9 rounded-l-sm border-s-0 border-opacity-5 focus:outline-none flex items-center w-24 relative"
        style={{ color: methodColors[method] || '#737373', background: '#1B1B1B' }}
        onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
      >
        <span className="flex-1 text-left">{method}</span>
        <span className="flex items-center justify-end" style={{ minWidth: 24 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>
      {methodDropdownOpen && (
        <div
          className="absolute left-0 mt-1 w-32 max-h-64 rounded-md shadow-lg z-50 overflow-y-auto border border-zinc-800 bg-[#1B1B1B] scrollbar-hide"
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
    <input
      className="flex-1 bg-[#1B1B1B] rounded-r-sm  border-s-0 border-opacity-5 px-4 py-2 h-9 text-white focus:outline-none"
      placeholder="https://echo.hoppscotch.io"
      value={url}
      onChange={e => setUrl(e.target.value)}
    />
    <div className="relative flex">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-l-md font-semibold"
        onClick={onSend}
      >
        Send
      </button>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-r-md font-semibold border-l border-blue-700"
        onClick={onSendMenuOpen}
        aria-label="Send options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {sendMenuOpen && (
        <div
          ref={sendMenuRef}
          className="absolute left-0 mt-2 w-56 bg-[#18181A] rounded-xl shadow-2xl border border-zinc-800 z-50 p-2"
          style={{ top: '100%' }}
        >
          <button
            className="flex items-center w-full px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3"
            onClick={onShowImportCurlModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
            <span className="flex-1 text-left">Import cURL</span>
            <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">C</span>
          </button>
          <button
            className="flex items-center w-full px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3"
            onClick={onShowGenerateCodeModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18 22 12 16 6"/><path d="M8 6 2 12l6 6"/></svg>
            <span className="flex-1 text-left">Show code</span>
            <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">S</span>
          </button>
          <button className="flex items-center w-full px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
            <span className="flex-1 text-left">Clear all</span>
            <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">⌫</span>
          </button>
        </div>
      )}
    </div>
    <button className="bg-[#1C1C1E] hover:bg-[#262626] text-white px-4 py-2 rounded-l-md  font-semibold ml-4 h-10 " onClick={onShowSaveModal}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
    </button>
    <div className="relative inline-block">
      <button
        className="bg-[#1C1C1E] hover:bg-[#262626] text-white px-2 py-2 rounded-r-md font-semibold"
        onClick={onShowSaveDropdown}
        aria-label="Save options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
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
);

export default RequestEditor; 