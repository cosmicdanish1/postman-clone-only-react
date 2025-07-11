// File: PostRequestTabContent.tsx
// Type: Component (post-request tab content)
// Imports: React, MonacoEditor, utility functions
// Imported by: TabContentArea.tsx
// Role: Renders the UI for editing and running post-request scripts in the request editor.
// Located at: src/components/TabContentArea/PostRequestTabContent.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface PostRequestTabContentProps {
  postRequestScript: string;
  setPostRequestScript: (script: string) => void;
  insertPostRequestSnippet: (snippet: string) => void;
  highlightPostRequestScript: (script: string) => React.ReactNode;
  postRequestDivRef: React.RefObject<HTMLDivElement>;
}

const getMonacoTheme = (theme: string) => {
  if (theme === 'light') return 'vs-light';
  if (theme === 'dark' || theme === 'system') return 'vs-dark';
  if (theme === 'black') return 'vs-dark'; // or a custom theme if registered
  return 'vs-dark';
};

const PostRequestTabContent: React.FC<PostRequestTabContentProps> = ({
  postRequestScript,
  setPostRequestScript,
  insertPostRequestSnippet,
  highlightPostRequestScript,
  postRequestDivRef,
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
        <span className="text-gray-400 text-sm">{t('post_request_script')}</span>
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
              value={postRequestScript}
              onChange={v => setPostRequestScript(v || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, scrollbar: { vertical: 'hidden', horizontal: 'hidden' } }}
            />
          </div>
        </div>
        {/* Right: info panel */}
        <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6 ">
          <span className="text-zinc-400 text-base mb-2">{t('post_request_info')}</span>
          <a
            href="https://learning.postman.com/docs/writing-scripts/test-scripts/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-zinc-200 hover:underline mb-6"
          >
            {t('read_documentation')}
          </a>
          <div className="font-bold text-zinc-300 mb-2">{t('snippets')}</div>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Set an environment variable\n' + 'pw.env.set("variable", "value");\n'); }}>{t('snippet_env_set')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 200\npw.test("Status code is 200", ()=> {\n    pw.expect(pw.response.status).toBe(200);\n});\n'); }}>{t('snippet_resp_200')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check JSON response property\npw.test("Check JSON response property", ()=> {\n    pw.expect(pw.response.body.method).toBe("GET");\n});\n'); }}>{t('snippet_resp_assert_property')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 2xx\npw.test("Status code is 2xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel2xx();\n});\n'); }}>{t('snippet_status_2xx')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 3xx\npw.test("Status code is 3xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel3xx();\n});\n'); }}>{t('snippet_status_3xx')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 4xx\npw.test("Status code is 4xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel4xx();\n});\n'); }}>{t('snippet_status_4xx')}</a>
          <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 5xx\npw.test("Status code is 5xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel5xx();\n});\n'); }}>{t('snippet_status_5xx')}</a>
        </div>
      </div>
    </div>
  );
};

export default PostRequestTabContent; 