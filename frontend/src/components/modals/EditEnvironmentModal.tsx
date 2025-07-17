// File: EditEnvironmentModal.tsx
// Type: Component (modal dialog for editing environments)
// Imports: React, utility functions
// Imported by: Main request/response editors or layout components
// Role: Renders a modal dialog for editing environment variables.
// Located at: src/components/EditEnvironmentModal.tsx
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface EditEnvironmentModalProps {
  open: boolean;
  onClose: () => void;
  modalValue: string;
  setModalValue: (val: string) => void;
  onSave: () => void;
}

const EditEnvironmentModal: React.FC<EditEnvironmentModalProps> = ({ open, onClose, modalValue, setModalValue, onSave }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    }
  };

  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 ${themeClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-environment-title"
    >
      <div
        className="mt-8 bg-bg rounded-2xl shadow-2xl border border-border w-[600px] max-w-full p-0 text-text"
        role="document"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-8 pt-8 pb-4 relative">
            <h2 id="edit-environment-title" className="text-2xl font-bold text-center w-full">
              {t('edit_environment')}
            </h2>
            <button
              className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={onClose}
              aria-label={t('close')}
            >
              &times;
            </button>
          </div>

          <div className="px-8 pb-4">
            <label htmlFor="environment-label" className="block text-xs text-gray-400 mb-1">
              {t('label')}
            </label>
            <input
              id="environment-label"
              ref={inputRef}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={modalValue}
              onChange={e => setModalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-required="true"
              aria-label={t('environment_name')}
            />
          </div>

          <div className="px-8 flex gap-6 border-b border-zinc-800">
            <button
              className="py-2 font-semibold border-b-2 border-blue-500 text-white focus:outline-none"
              aria-current="true"
            >
              {t('variables')}
            </button>
            <button
              className="py-2 font-semibold text-zinc-400 hover:text-white focus:outline-none focus:text-white"
              aria-current="false"
            >
              {t('secrets')}
            </button>
          </div>

          <div className="px-8 py-8 flex flex-col items-center justify-center min-h-[200px]">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 opacity-40"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="40" height="40" rx="8" fill="#232326" />
              <path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-zinc-400 text-sm mt-2 mb-4">
              {t('environments_empty')}
            </span>
            <button
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {}}
            >
              {t('add_new')}
            </button>
          </div>

          <div className="flex gap-4 justify-start px-8 pb-8">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg"
              onClick={onSave}
              disabled={!modalValue.trim()}
            >
              {t('save')}
            </button>
            <button
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg"
              onClick={onClose}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEnvironmentModal; 