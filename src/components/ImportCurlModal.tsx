// File: ImportCurlModal.tsx
// Type: Component (modal dialog for importing cURL)
// Imports: React, utility functions
// Imported by: Main request/response editors or layout components
// Role: Renders a modal dialog for importing requests from cURL commands.
// Located at: src/components/ImportCurlModal.tsx
import React from 'react';

interface ImportCurlModalProps {
  open: boolean;
  onClose: () => void;
  curlInput: string;
  setCurlInput: (val: string) => void;
  onImport: () => void;
}

const ImportCurlModal: React.FC<ImportCurlModalProps> = ({ open, onClose, curlInput, setCurlInput, onImport }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0 relative">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="text-2xl font-bold text-center w-full">Import cURL</div>
          <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={onClose}>&times;</button>
        </div>
        <div className="px-8 pb-4">
          <label className="block text-xs text-gray-400 mb-1">cURL</label>
          <div className="relative bg-zinc-900 rounded-lg border border-zinc-800">
            {/* Toolbar icons */}
            <div className="absolute right-2 top-2 flex gap-2 z-10">
              <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg></button>
              <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></button>
              <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
            </div>
            <textarea
              className="w-full h-32 bg-transparent text-white p-4 rounded-lg focus:outline-none resize-none placeholder-zinc-500 mt-6"
              placeholder="Enter cURL command"
              value={curlInput}
              onChange={e => setCurlInput(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 15 }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold" onClick={onImport}>Import</button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={onClose}>Cancel</button>
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            Paste
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportCurlModal; 