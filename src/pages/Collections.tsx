import React from 'react';

const Collections: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      <div className="text-xs text-zinc-400 mb-2">Collections are empty</div>
      <div className="text-zinc-400 mb-4">Import or create a collection</div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
        Import
      </button>
      <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-2 rounded font-semibold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add new
      </button>
    </div>
  );
};

export default Collections; 