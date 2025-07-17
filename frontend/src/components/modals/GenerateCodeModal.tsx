// File: GenerateCodeModal.tsx
// Type: Component (modal dialog for code generation)
// Imports: React, utility functions, and code generation helpers
// Imported by: Main request/response editors or layout components
// Role: Renders a modal dialog for generating code snippets for requests.
// Located at: src/components/GenerateCodeModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface GenerateCodeModalProps {
  open: boolean;
  onClose: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (val: string) => void;
  generatedCode: string;
}

const GenerateCodeModal: React.FC<GenerateCodeModalProps> = ({
  open,
  onClose,
  selectedLanguage,
  setSelectedLanguage,
  generatedCode
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const languageSelectRef = useRef<HTMLSelectElement>(null);

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

  // Focus the language select when modal opens
  useEffect(() => {
    if (open && languageSelectRef.current) {
      languageSelectRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleCopyCode = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success(t('copy_toast'), {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: theme
      });
    } catch (err) {
      toast.error(t('copy_failed'), {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 ${themeClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-code-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-bg rounded-2xl shadow-2xl border border-border w-[600px] max-w-full p-0 relative text-text"
        role="document"
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4 relative">
          <h2 id="generate-code-title" className="text-2xl font-bold text-center w-full">
            {t('generate_code')}
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
            htmlFor="language-select"
            className="block text-xs text-gray-400 mb-1"
          >
            {t('choose_language')}
          </label>
          <select
            id="language-select"
            ref={languageSelectRef}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            aria-label={t('choose_language')}
          >
            <option value="shell_curl">{t('shell_curl')}</option>
            <option value="node_fetch">{t('node_fetch')}</option>
            <option value="python_requests">{t('python_requests')}</option>
            <option value="go_http">{t('go_http')}</option>
            <option value="js_xhr">{t('js_xhr')}</option>
          </select>

          <label
            htmlFor="generated-code"
            className="block text-xs text-gray-400 mb-1"
          >
            {t('generated_code')}
          </label>

          <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="absolute right-2 top-2 flex gap-2 z-10">
              <button
                className="text-zinc-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleCopyCode}
                aria-label={t('copy')}
                title={t('copy')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button
                className="text-zinc-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => window.open('https://www.postman.com/downloads/', '_blank')}
                aria-label={t('download')}
                title={t('download')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                  <polyline points="7 11 12 16 17 11"></polyline>
                  <line x1="12" y1="4" x2="12" y2="16"></line>
                </svg>
              </button>
            </div>

            <pre
              id="generated-code"
              ref={codeRef}
              className="text-white text-sm font-mono whitespace-pre-wrap mt-6 overflow-auto max-h-[400px] p-2 bg-zinc-950 rounded"
              tabIndex={0}
              aria-label={t('generated_code')}
            >
              {generatedCode}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
            onClick={handleCopyCode}
            disabled={!generatedCode}
          >
            {t('copy')}
          </button>
          <button
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg"
            onClick={onClose}
          >
            {t('dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateCodeModal;