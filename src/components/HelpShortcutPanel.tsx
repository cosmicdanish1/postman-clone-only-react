import React from 'react';
import { useTranslation } from 'react-i18next';
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

  // Use CSS custom properties for proper theming
  const panelStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
  };

  const kbdStyle: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#e5e7eb' : '#374151',
    color: theme === 'light' ? '#374151' : '#e5e7eb',
    border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
  };

  const hoverStyle: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
  };

  return (
    <div 
      className={`w-full flex flex-col items-center justify-center p-4 rounded-t-lg ${themeClass}`}
      style={panelStyle}
    >
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: 'var(--color-text)' }}>{t('send_request')}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>Ctrl</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>↵</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: 'var(--color-text)' }}>{t('keyboard_shortcuts')}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>Ctrl</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>/</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: 'var(--color-text)' }}>{t('search_command_menu')}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>Ctrl</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>K</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: 'var(--color-text)' }}>{t('help_menu')}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={kbdStyle}>?</span>
        </div>
        <a
          href={documentationUrl}
          className="mt-2 px-3 py-1 rounded text-xs font-semibold text-center transition-colors"
          style={{ 
            backgroundColor: accentHex, 
            color: 'white',
            ...hoverStyle 
          }}
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