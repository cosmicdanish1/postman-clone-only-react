// File: RealtimeHelpPanel.tsx
// Type: Component (help panel for Realtime page)
// Imports: React
// Imported by: Realtime.tsx
// Role: Displays help and documentation for real-time protocols.
// Located at: src/pages/Realtime/RealtimeHelpPanel.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';

const RealtimeHelpPanel: React.FC = () => {
  const { t } = useTranslation();
  const { themeClass, accentColor } = useThemeClass();
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-bg text-text ${themeClass}`}>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('realtime.help.send_request')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">↵</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('realtime.help.keyboard_shortcuts')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">/</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('realtime.help.search_command_menu')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">K</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{t('realtime.help.help_menu')}</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">?</span>
        </div>
        <a
          href="#"
          className={`mt-4 bg-bg hover:bg-bg/80 text-text px-4 py-2 rounded font-semibold text-center border border-border transition-colors`}
          style={{ borderColor: accentColor }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('realtime.help.documentation')} <span className="inline-block align-middle ml-1"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14m-7 7h7v-7" /></svg></span>
        </a>
      </div>
    </div>
  );
};

export default RealtimeHelpPanel;