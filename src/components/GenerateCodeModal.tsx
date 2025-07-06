import React from 'react';

interface GenerateCodeModalProps {
  open: boolean;
  onClose: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (val: string) => void;
  generatedCode: string;
}

const GenerateCodeModal: React.FC<GenerateCodeModalProps> = ({ open, onClose, selectedLanguage, setSelectedLanguage, generatedCode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0 relative">
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="text-2xl font-bold text-center w-full">Generate code</div>
          <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={onClose}>&times;</button>
        </div>
        <div className="px-8 pb-4">
          <label className="block text-xs text-gray-400 mb-1">Choose language</label>
          <select
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4"
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
          >
            <option>Shell - cURL</option>
            <option>Node.js - fetch</option>
            <option>Python - requests</option>
            <option>Go - http</option>
            <option>JavaScript - XMLHttpRequest</option>
          </select>
          <label className="block text-xs text-gray-400 mb-1">Generated code</label>
          <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            {/* Toolbar icons */}
            <div className="absolute right-2 top-2 flex gap-2 z-10">
              <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
              <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></button>
              <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
            </div>
            <pre className="text-white text-sm font-mono whitespace-pre mt-6">
{generatedCode}
            </pre>
          </div>
        </div>
        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">Copy</button>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCodeModal; 