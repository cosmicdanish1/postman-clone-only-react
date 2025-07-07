// File: GraphQLQueryEditor.tsx
// Type: Component (editor for GraphQL queries)
// Imports: React, MonacoEditor
// Imported by: GraphQLTabContentArea.tsx
// Role: Allows editing of the GraphQL query for the active tab.
// Located at: src/pages/GraphQL/GraphQLQueryEditor.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface GraphQLQueryEditorProps {
  query: string;
  onChange: (val: string) => void;
}

const GraphQLQueryEditor: React.FC<GraphQLQueryEditorProps> = ({ query, onChange }) => (
  <div className="flex flex-col flex-1 min-h-0">
    {/* Query Toolbar */}
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <span className="text-gray-400 font-medium">Query</span>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-400 font-medium" title="Send Request (Ctrl+Enter)">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          <span>Request</span>
        </button>
        <button className="flex items-center gap-1 text-gray-300 hover:text-white" title="Save">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
          <span>Save</span>
        </button>
        <button className="text-gray-300 hover:text-white" title="Help">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12" y2="17" /></svg>
        </button>
        <button className="text-gray-300 hover:text-white" title="Delete">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
        </button>
        <button className="text-gray-300 hover:text-white" title="Format">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /></svg>
        </button>
        <button className="text-gray-300 hover:text-white" title="Snippets">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /></svg>
        </button>
        <button className="text-gray-300 hover:text-white" title="Copy">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        </button>
      </div>
    </div>
    {/* Monaco Editor for Query */}
    <div className="flex-1 flex min-h-0 px-4 bg-neutral-900">
      <style>{`
        .monaco-editor, .monaco-editor-background, .monaco-editor .margin, .monaco-editor .inputarea.ime-input {
          background-color: #171717 !important;
        }
      `}</style>
      <MonacoEditor
        height="100%"
        defaultLanguage="graphql"
        language="graphql"
        theme="vs-dark"
        value={query}
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

export default GraphQLQueryEditor; 