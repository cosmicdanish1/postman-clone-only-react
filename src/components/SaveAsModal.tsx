// File: SaveAsModal.tsx
// Type: Component (modal dialog for saving as)
// Imports: React, utility functions
// Imported by: Main request/response editors or layout components
// Role: Renders a modal dialog for saving requests or collections under a new name.
// Located at: src/components/SaveAsModal.tsx
import React from 'react';

interface SaveAsModalProps {
  open: boolean;
  onClose: () => void;
  saveRequestName: string;
  setSaveRequestName: (val: string) => void;
  onSave: () => void;
}

const SaveAsModal: React.FC<SaveAsModalProps> = ({ open, onClose, saveRequestName, setSaveRequestName, onSave }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0 relative">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="text-2xl font-bold text-center w-full">Save as</div>
          <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={onClose}>&times;</button>
        </div>
        <div className="px-8 pb-4">
          <label className="block text-xs text-gray-400 mb-1">Request name</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4"
            value={saveRequestName}
            onChange={e => setSaveRequestName(e.target.value)}
          />
          <label className="block text-xs text-gray-400 mb-1">Select location</label>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2">
            <div className="text-xs text-zinc-400 mb-2">Personal Workspace &gt; Collections</div>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm mb-2"
              placeholder="Search"
            />
            <div className="flex items-center gap-2 mb-2">
              <button className="flex items-center gap-1 text-blue-400 hover:text-blue-500 text-sm font-semibold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m7-7H5"/></svg>
                New
              </button>
              <button className="ml-auto text-zinc-400 hover:text-white" title="Help"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg></button>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-40"><rect x="8" y="8" width="40" height="40" rx="8" fill="#232326"/><path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="text-zinc-400 text-sm mt-2">Environments are empty</span>
              <span className="text-zinc-500 text-xs mb-4">Import or create a collection</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                Import
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold" onClick={onSave}>Save</button>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SaveAsModal; 