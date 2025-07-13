// File: CommunicationTab.tsx
// Type: Component (tab for communication protocols)
// Imports: React
// Imported by: Realtime.tsx or protocol tab bar
// Role: Renders the UI for selecting and configuring communication protocols (WebSocket, SSE, etc.).
// Located at: src/pages/Realtime/CommunicationTab.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface CommunicationTabProps {
  message: string;
  setMessage: (val: string) => void;
}

const getMonacoTheme = (theme: string) => {
  if (theme === 'light') return 'vs-light';
  if (theme === 'dark' || theme === 'system') return 'vs-dark';
  if (theme === 'black') return 'vs-dark'; // or a custom theme if registered
  return 'vs-dark';
};

const CommunicationTab: React.FC<CommunicationTabProps> = ({ message, setMessage }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`flex flex-col flex-1 min-h-0 bg-bg text-text ${themeClass}`}>
      {/* Message Bar */}
      <div className="flex items-center gap-2 mb-2 bg-bg">
        <span className="text-gray-400">{t('message')}</span>
        <select className="bg-transparent text-text font-semibold px-1 py-0 focus:outline-none">
          <option>{t('json')}</option>
          <option>{t('raw')}</option>
        </select>
        <button className="text-blue-500 flex items-center gap-1 font-semibold ml-2">
          <span className="material-icons" style={{ fontSize: 20 }}>send</span> {t('send')}
        </button>
        <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer ml-2">
          <input type="checkbox" className="accent-blue-600" /> {t('clear_input')}
        </label>
        <button className="ml-2 text-gray-400 hover:text-white" title={t('help')}>
          <span className="material-icons">help_outline</span>
        </button>
        <button className="text-gray-400 hover:text-white" title={t('delete')}>
          <span className="material-icons">delete</span>
        </button>
        <button className="text-gray-400 hover:text-white" title={t('history')}>
          <span className="material-icons">history</span>
        </button>
        <button className="text-gray-400 hover:text-white" title={t('format')}>
          <span className="material-icons">format_align_left</span>
        </button>
        <button className="text-gray-400 hover:text-white" title={t('copy')}>
          <span className="material-icons">content_copy</span>
        </button>
      </div>
      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-0 bg-bg">
        <MonacoEditor
          language="json"
          theme={getMonacoTheme(theme)}
          value={message}
          onChange={val => setMessage(val || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollbar: { vertical: 'auto' } }}
        />
      </div>
    </div>
  );
};

export default CommunicationTab; 