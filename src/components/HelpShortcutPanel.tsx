import React from 'react';
import { useTranslation } from 'react-i18next';

interface HelpShortcutPanelProps {
  documentationUrl: string;
}

const HelpShortcutPanel: React.FC<HelpShortcutPanelProps> = ({ documentationUrl }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 rounded-t-lg">
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('send_request')}</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">↵</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('keyboard_shortcuts')}</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">/</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('search_command_menu')}</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">K</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('help_menu')}</span>
          <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono">?</span>
        </div>
        <a
          href={documentationUrl}
          className="mt-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-xs font-semibold text-center transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('documentation')}
        </a>
      </div>
    </div>
  );
};

export default HelpShortcutPanel; 