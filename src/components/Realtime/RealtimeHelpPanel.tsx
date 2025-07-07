import React from 'react';

const RealtimeHelpPanel: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8">
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Send Request</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">Ctrl</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">↵</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Keyboard shortcuts</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">Ctrl</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">/</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Search & command menu</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">Ctrl</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">K</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Help menu</span>
        <span className="bg-[#232329] px-2 py-1 rounded text-xs">?</span>
      </div>
      <a
        href="#"
        className="mt-4 bg-[#232329] hover:bg-[#232329]/80 text-white px-4 py-2 rounded font-semibold text-center border border-[#232329]"
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation <span className="inline-block align-middle ml-1"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14m-7 7h7v-7" /></svg></span>
      </a>
    </div>
  </div>
);

export default RealtimeHelpPanel; 