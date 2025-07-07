// File: PostRequestTabContent.tsx
// Type: Component (post-request tab content)
// Imports: React, MonacoEditor, utility functions
// Imported by: TabContentArea.tsx
// Role: Renders the UI for editing and running post-request scripts in the request editor.
// Located at: src/components/TabContentArea/PostRequestTabContent.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface PostRequestTabContentProps {
  postRequestScript: string;
  setPostRequestScript: (script: string) => void;
  insertPostRequestSnippet: (snippet: string) => void;
  highlightPostRequestScript: (script: string) => React.ReactNode;
  postRequestDivRef: React.RefObject<HTMLDivElement>;
}

const PostRequestTabContent: React.FC<PostRequestTabContentProps> = ({
  postRequestScript,
  setPostRequestScript,
  insertPostRequestSnippet,
  highlightPostRequestScript,
  postRequestDivRef,
}) => (
  <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
    <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-800">
      <span className="text-gray-400 text-sm">Post-request Script</span>
    </div>
    <div className="flex flex-1 min-h-0">
      {/* Left: MonacoEditor */}
      <div className="flex-1 flex bg-[#18181A] min-h-0 border-r border-neutral-900" style={{ fontFamily: 'monospace' }}>
        <div className="w-full h-full">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            language="javascript"
            theme="vs-dark"
            value={postRequestScript}
            onChange={v => setPostRequestScript(v || '')}
            options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, scrollbar: { vertical: 'hidden', horizontal: 'hidden' } }}
          />
        </div>
      </div>
      {/* Right: info panel */}
      <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6 bg-[#18181A]">
        <span className="text-zinc-400 text-base mb-2">Post-request scripts are written in JavaScript, and are run after the response is received.</span>
        <a
          href="https://learning.postman.com/docs/writing-scripts/test-scripts/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-zinc-200 hover:underline mb-6"
        >
          Read documentation
        </a>
        <div className="font-bold text-zinc-300 mb-2">Snippets</div>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Set an environment variable\n' + 'pw.env.set("variable", "value");\n'); }}>Environment: Set an environment variable</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 200\npw.test("Status code is 200", ()=> {\n    pw.expect(pw.response.status).toBe(200);\n});\n'); }}>Response: Status code is 200</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check JSON response property\npw.test("Check JSON response property", ()=> {\n    pw.expect(pw.response.body.method).toBe("GET");\n});\n'); }}>Response: Assert property from body</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 2xx\npw.test("Status code is 2xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel2xx();\n});\n'); }}>Status code: Status code is 2xx</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 3xx\npw.test("Status code is 3xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel3xx();\n});\n'); }}>Status code: Status code is 3xx</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 4xx\npw.test("Status code is 4xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel4xx();\n});\n'); }}>Status code: Status code is 4xx</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 5xx\npw.test("Status code is 5xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel5xx();\n});\n'); }}>Status code: Status code is 5xx</a>
      </div>
    </div>
  </div>
);

export default PostRequestTabContent; 