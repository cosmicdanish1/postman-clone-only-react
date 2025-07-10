import React from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeStyles } from '../utils/getThemeStyles';
import { useSelector } from 'react-redux';

interface HelpShortcutPanelProps {
  documentationUrl: string;
}

const HelpShortcutPanel: React.FC<HelpShortcutPanelProps> = ({ documentationUrl }) => {
  const { t } = useTranslation();
  const theme = useSelector((state: any) => state.theme.theme);
  const accentColor = useSelector((state: any) => state.theme.accentColor);

  // 🟡 Theme and Accent Color Setup
  const accentColors = [
    { key: 'green', color: '#22c55e' },
    { key: 'blue', color: '#2563eb' },
    { key: 'cyan', color: '#06b6d4' },
    { key: 'purple', color: '#7c3aed' },
    { key: 'yellow', color: '#eab308' },
    { key: 'orange', color: '#f59e42' },
    { key: 'red', color: '#ef4444' },
    { key: 'pink', color: '#ec4899' },
  ];

  const accentHex = accentColors.find(c => c.key === accentColor)?.color;

  // 🟡 Dynamic classes based on theme
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

  let bgClass = 'bg-gray-100';
  let textClass = 'text-gray-600';
  let kbdClass = 'bg-gray-200 text-gray-800 border border-gray-300';
  let hoverClass = 'hover:bg-gray-200';

  if (theme === 'black') {
    bgClass = 'bg-black';
    textClass = 'text-gray-300';
    kbdClass = 'bg-gray-800 text-gray-200 border border-gray-600';
    hoverClass = 'hover:bg-gray-900';
  } else if (theme === 'dark') {
    bgClass = 'bg-gray-900';
    textClass = 'text-gray-300';
    kbdClass = 'bg-gray-800 text-gray-200 border border-gray-600';
    hoverClass = 'hover:bg-gray-800';
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center p-4 rounded-t-lg ${bgClass} ${textClass} ${themeClass}`}>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-1">
          <span className={`text-xs ${textClass}`}>{t('send_request')}</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>Ctrl</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>↵</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs ${textClass}`}>{t('keyboard_shortcuts')}</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>Ctrl</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>/</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs ${textClass}`}>{t('search_command_menu')}</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>Ctrl</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>K</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs ${textClass}`}>{t('help_menu')}</span>
          <span className={`${kbdClass} px-1.5 py-0.5 rounded text-[10px] font-mono`}>?</span>
        </div>
        <a
          href={documentationUrl}
          className={`mt-2 ${hoverClass} px-3 py-1 rounded text-xs font-semibold text-center transition-colors`}
          style={{ backgroundColor: accentHex, color: 'white' }}
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