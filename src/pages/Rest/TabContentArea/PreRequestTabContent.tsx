// File: PreRequestTabContent.tsx
// Type: Component (pre-request tab content)
// Imports: React, MonacoEditor, utility functions
// Imported by: TabContentArea.tsx
// Role: Renders the UI for editing and running pre-request scripts in the request editor.
// Located at: src/components/TabContentArea/PreRequestTabContent.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface PreRequestTabContentProps {
  preRequestScript: string;
  setPreRequestScript: (script: string) => void;
  insertPreRequestSnippet: (snippet: string) => void;
}

const getMonacoTheme = (theme: string) => {
  if (theme === 'light') return 'vs-light';
  if (theme === 'dark' || theme === 'system') return 'vs-dark';
  if (theme === 'black') return 'vs-dark'; // or a custom theme if registered
  return 'vs-dark';
};

const PreRequestTabContent: React.FC<PreRequestTabContentProps> = ({
  preRequestScript,
  setPreRequestScript,
  insertPreRequestSnippet,
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`flex-1 flex flex-col bg-bg text-text rounded p-0 mt-2 ${themeClass}`}>
      <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-800">
        <span className="text-gray-400 text-sm">{t('pre_request_script')}</span>
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Left: MonacoEditor */}
        <div className="flex-1 flex  min-h-0 border-r border-neutral-900" style={{ fontFamily: 'monospace' }}>
          <div className="w-full h-full">
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              language="javascript"
              theme={getMonacoTheme(theme)}
              value={preRequestScript}
              onChange={v => setPreRequestScript(v || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, scrollbar: { vertical: 'hidden', horizontal: 'hidden' } }}
            />
          </div>
        </div>
        {/* Right: info panel */}
        <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6 ">
          <span className="text-zinc-400 text-base mb-2">{t('pre_request_info')}</span>
          <a
            href="https://learning.postman.com/docs/writing-scripts/pre-request-scripts/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-zinc-200 hover:underline mb-6"
          >
            {t('read_documentation')}
          </a>
          <div className="font-bold text-zinc-300 mb-2">{t('snippets')}</div>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set an environment variable\n' + 'pw.env.set("variable", "value");\n'); }}>{t('snippet_env_set')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set a request header\n' + 'pw.request.headers["X-My-Header"] = "value";\n'); }}>{t('snippet_req_set')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set a variable from a previous response\n' + 'pw.env.set("token", pw.response.body.token);\n'); }}>{t('snippet_resp_set')}</a>
          <a href="#" className="text-blue-500 hover:underline" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Log to console\n' + 'console.log("Hello from pre-request script");\n'); }}>{t('snippet_console_log')}</a>
        </div>
      </div>
    </div>
  );
};

export default PreRequestTabContent; 