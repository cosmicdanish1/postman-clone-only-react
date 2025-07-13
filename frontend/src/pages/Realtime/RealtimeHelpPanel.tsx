// File: RealtimeHelpPanel.tsx
// Type: Component (help panel for Realtime page)
// Imports: React
// Imported by: Realtime.tsx
// Role: Displays help and documentation for real-time protocols.
// Located at: src/pages/Realtime/RealtimeHelpPanel.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const RealtimeHelpPanel: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-bg text-text ${themeClass}`}>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('send_request')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">↵</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('keyboard_shortcuts')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">/</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('search_command_menu')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">K</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('help_menu')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">?</span>
        </div>
        <a
          href="#"
          className="mt-4 bg-bg hover:bg-bg/80 text-text px-4 py-2 rounded font-semibold text-center border border-border"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('documentation')} <span className="inline-block align-middle ml-1"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14m-7 7h7v-7" /></svg></span>
        </a>
      </div>
    </div>
  );
};

export default RealtimeHelpPanel; 