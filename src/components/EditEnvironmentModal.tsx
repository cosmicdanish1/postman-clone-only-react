import React from 'react';

interface EditEnvironmentModalProps {
  open: boolean;
  onClose: () => void;
  modalValue: string;
  setModalValue: (val: string) => void;
  onSave: () => void;
}

const EditEnvironmentModal: React.FC<EditEnvironmentModalProps> = ({ open, onClose, modalValue, setModalValue, onSave }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60">
      <div id="edit-env-modal" className="mt-8 bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
            <div className="text-2xl font-bold text-center w-full">Edit Environment</div>
            <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={onClose}>&times;</button>
          </div>
          <div className="px-8 pb-4">
            <label className="block text-xs text-gray-400 mb-1">Label</label>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4" value={modalValue} onChange={e => setModalValue(e.target.value)} />
          </div>
          <div className="px-8 flex gap-6 border-b border-zinc-800">
            <button className="py-2 font-semibold border-b-2 border-blue-500 text-white">Variables</button>
            <button className="py-2 font-semibold text-zinc-400">Secrets</button>
          </div>
          <div className="px-8 py-8 flex flex-col items-center justify-center min-h-[200px]">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-40"><rect x="8" y="8" width="40" height="40" rx="8" fill="#232326"/><path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-zinc-400 text-sm mt-2 mb-4">Environments are empty</span>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
              + Add new
            </button>
          </div>
          <div className="flex gap-4 justify-start px-8 pb-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold" onClick={onSave}>Save</button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEnvironmentModal; 