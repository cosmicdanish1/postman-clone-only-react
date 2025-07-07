import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface GraphQLVariablesEditorProps {
  variables: string | object;
  onChange: (val: string) => void;
}

const DEFAULT_VARIABLES = '{\n  "id": "1"\n}';

const GraphQLVariablesEditor: React.FC<GraphQLVariablesEditorProps> = ({ variables, onChange }) => {
  let value: string;
  if (typeof variables === 'string') {
    value = variables.trim() === '' ? DEFAULT_VARIABLES : variables;
  } else if (!variables || (typeof variables === 'object' && Object.keys(variables).length === 0)) {
    value = DEFAULT_VARIABLES;
  } else {
    value = JSON.stringify(variables, null, 2);
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-900 min-h-0">
      {/* Variables Bar */}
      <div className="flex items-center justify-between px-4 h-10 bg-[#18181A] w-full border-b border-neutral-800">
        <span className="text-gray-400 text-base">Variables</span>
        <div className="flex items-center gap-3">
          {/* Help icon */}
          <button className="text-gray-400 hover:text-white" title="Help">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </button>
          {/* Delete icon */}
          <button className="text-gray-400 hover:text-white" title="Delete">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
          </button>
          {/* Edit icon */}
          <button className="text-gray-400 hover:text-white" title="Edit">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
          </button>
          {/* Prettify icon */}
          <button className="text-gray-400 hover:text-white" title="Prettify">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m8-8h2M2 12H4m15.07-7.07l1.42 1.42M4.93 19.07l1.42-1.42m12.02 0l1.42 1.42M4.93 4.93l1.42 1.42"/></svg>
          </button>
          {/* Copy icon */}
          <button className="text-gray-400 hover:text-white" title="Copy">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </div>
      {/* MonacoEditor for Variables */}
      <div className="flex-1 flex min-h-0 px-4 pb-4">
        <MonacoEditor
          height="100%"
          defaultLanguage="json"
          language="json"
          theme="vs-dark"
          value={value}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
            renderLineHighlight: 'all',
            formatOnPaste: true,
            formatOnType: true,
            padding: { top: 8, bottom: 8 },
          }}
          onChange={val => onChange(val || '')}
        />
      </div>
    </div>
  );
};

export default GraphQLVariablesEditor; 