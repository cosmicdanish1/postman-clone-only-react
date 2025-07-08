// File: ScriptTab.tsx
// Type: Component (script tab)
// Imports: React
// Imported by: Main request/response editors or layout components
// Role: Renders a tab for editing scripts (pre-request or post-request).
// Located at: src/components/ScriptTab.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ScriptTab: React.FC<{ label: string }> = ({ label }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`space-y-2 bg-bg text-text ${themeClass}`}>
      <label className="block text-text text-sm font-semibold mb-1">{label}</label>
      <textarea
        className="w-full min-h-[100px] bg-bg text-text rounded px-2 py-1 text-sm focus:outline-none resize-y border border-border"
        placeholder={t('script_placeholder', { label: label.toLowerCase() })}
      />
      <div className="text-xs text-text/70 mt-2">{t('scripting_not_implemented')}</div>
    </div>
  );
};

export default ScriptTab; 