import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface PreRequestTabContentProps {
  preRequestScript: string;
  setPreRequestScript: (script: string) => void;
  insertPreRequestSnippet: (snippet: string) => void;
  highlightPreRequestScript: (script: string) => React.ReactNode;
  preRequestDivRef: React.RefObject<HTMLDivElement>;
}

const PreRequestTabContent: React.FC<PreRequestTabContentProps> = ({
  preRequestScript,
  setPreRequestScript,
  insertPreRequestSnippet,
  highlightPreRequestScript,
  preRequestDivRef,
}) => (
  <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
    <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-800">
      <span className="text-gray-400 text-sm">Pre-request Script</span>
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
            value={preRequestScript}
            onChange={v => setPreRequestScript(v || '')}
            options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, scrollbar: { vertical: 'hidden', horizontal: 'hidden' } }}
          />
        </div>
      </div>
      {/* Right: info panel */}
      <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6 bg-[#18181A]">
        <span className="text-zinc-400 text-base mb-2">Pre-request scripts are written in JavaScript, and are run before the request is sent.</span>
        <a
          href="https://learning.postman.com/docs/writing-scripts/pre-request-scripts/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-zinc-200 hover:underline mb-6"
        >
          Read documentation
        </a>
        <div className="font-bold text-zinc-300 mb-2">Snippets</div>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set an environment variable\n' + 'pw.env.set("variable", "value");\n'); }}>Environment: Set an environment variable</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set a request header\n' + 'pw.request.headers["X-My-Header"] = "value";\n'); }}>Request: Set a request header</a>
        <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set a variable from a previous response\n' + 'pw.env.set("token", pw.response.body.token);\n'); }}>Response: Set variable from response</a>
        <a href="#" className="text-blue-500 hover:underline" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Log to console\n' + 'console.log("Hello from pre-request script");\n'); }}>Console: Log to console</a>
      </div>
    </div>
  </div>
);

export default PreRequestTabContent; 