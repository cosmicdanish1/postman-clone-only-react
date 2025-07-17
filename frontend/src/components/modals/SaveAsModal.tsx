// File: SaveAsModal.tsx
// Type: Component (modal dialog for saving as)
// Imports: React, utility functions
// Imported by: Main request/response editors or layout components
// Role: Renders a modal dialog for saving requests or collections under a new name.
// Located at: src/components/SaveAsModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface SaveAsModalProps {
  open: boolean;
  onClose: () => void;
  saveRequestName: string;
  setSaveRequestName: (val: string) => void;
  onSave: () => void;
}

const SaveAsModal: React.FC<SaveAsModalProps> = ({
  open,
  onClose,
  saveRequestName,
  setSaveRequestName,
  onSave
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && saveRequestName.trim()) {
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, saveRequestName]);

  // Focus the input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (!saveRequestName.trim()) {
      toast.error(t('request_name_required'), {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true
      });
      return;
    }
    onSave();
  };

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 ${themeClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-as-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg rounded-2xl shadow-2xl border border-border w-[600px] max-w-full p-0 relative text-text">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 relative">
          <h2 id="save-as-title" className="text-2xl font-bold text-center w-full">
            {t('save_as')}
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
          <label
            htmlFor="request-name-input"
            className="block text-xs text-gray-400 mb-1"
          >
            {t('request_name')}
          </label>
          <input
            id="request-name-input"
            ref={inputRef}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={saveRequestName}
            onChange={e => setSaveRequestName(e.target.value)}
            aria-required="true"
            aria-invalid={!saveRequestName.trim()}
          />

          <label className="block text-xs text-gray-400 mb-1">
            {t('select_location')}
          </label>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2">
            <div className="text-xs text-zinc-400 mb-2">
              {t('personal_workspace_collections')}
            </div>

            <div className="relative mb-2">
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 pl-8 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                aria-label={t('search_collections')}
              />
              <svg
                className={`absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 ${isSearching ? 'hidden' : 'block'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <button
                className="flex items-center gap-1 text-blue-400 hover:text-blue-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                onClick={() => {}}
                aria-label={t('create_new_collection')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14m7-7H5" />
                </svg>
                {t('new')}
              </button>

              <button
                className="ml-auto text-zinc-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t('help')}
                aria-label={t('help')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
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

              <span className="text-zinc-400 text-sm mt-2">
                {t('no_collections_found')}
              </span>
              <span className="text-zinc-500 text-xs mb-4">
                {t('import_or_create_collection')}
              </span>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                onClick={() => {}}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                {t('import')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
            onClick={handleSave}
            disabled={!saveRequestName.trim()}
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
  );
};

export default SaveAsModal;