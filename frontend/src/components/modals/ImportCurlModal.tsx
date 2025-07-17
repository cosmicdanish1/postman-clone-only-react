// File: ImportCurlModal.tsx
// Type: Component (modal dialog for importing cURL)
// Imports: React, utility functions
// Imported by: Main request/response editors or layout components
// Role: Renders a modal dialog for importing requests from cURL commands.
// Located at: src/components/ImportCurlModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface ImportCurlModalProps {
  open: boolean;
  onClose: () => void;
  curlInput: string;
  setCurlInput: (val: string) => void;
  onImport: () => void;
}

const ImportCurlModal: React.FC<ImportCurlModalProps> = ({
  open,
  onClose,
  curlInput,
  setCurlInput,
  onImport
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  const [isPasting, setIsPasting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

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

  // Focus the textarea when modal opens
  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handlePaste = async () => {
    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();
      setCurlInput(text);
      toast.success(t('pasted_from_clipboard'), {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true
      });
    } catch (err) {
      toast.error(t('clipboard_access_denied'), {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true
      });
    } finally {
      setIsPasting(false);
    }
  };

  const handleClear = () => {
    setCurlInput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleImportClick = () => {
    if (!curlInput.trim()) {
      toast.error(t('empty_curl_error'), {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true
      });
      return;
    }
    onImport();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 ${themeClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-curl-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg rounded-2xl shadow-2xl border border-border w-[600px] max-w-full p-0 relative text-text">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 relative">
          <h2 id="import-curl-title" className="text-2xl font-bold text-center w-full">
            {t('import_curl')}
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
            htmlFor="curl-input"
            className="block text-xs text-gray-400 mb-1"
          >
            {t('curl')}
          </label>

          <div className="relative bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="absolute right-2 top-2 flex gap-2 z-10">
              <button
                className="text-zinc-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                onClick={handleClear}
                disabled={!curlInput}
                aria-label={t('clear')}
                title={t('clear')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </button>
              <button
                className="text-zinc-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                onClick={handlePaste}
                disabled={isPasting}
                aria-label={t('paste')}
                title={t('paste')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <textarea
              id="curl-input"
              ref={textareaRef}
              className="w-full h-40 bg-transparent text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-zinc-500 mt-8"
              placeholder={t('enter_curl_command')}
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 15 }}
              aria-label={t('enter_curl_command')}
              spellCheck="false"
              rows={6}
            />
          </div>

          <div className="mt-2 text-xs text-zinc-400">
            {t('paste_curl_hint')}
          </div>
        </div>

        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <div className="flex gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
              onClick={handleImportClick}
              disabled={!curlInput.trim()}
            >
              {t('import')}
            </button>
            <button
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg"
              onClick={onClose}
            >
              {t('cancel')}
            </button>
          </div>

          <button
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
            onClick={handlePaste}
            disabled={isPasting}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {t('paste')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportCurlModal; 