// File: CommunicationTab.tsx
// Type: Component (tab for communication protocols)
// Imports: React
// Imported by: Realtime.tsx or protocol tab bar
// Role: Renders the UI for selecting and configuring communication protocols (WebSocket, SSE, etc.).
// Located at: src/pages/Realtime/CommunicationTab.tsx
import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CommunicationTabProps {
  message: string;
  setMessage: (val: string) => void;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({ message, setMessage }) => {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Message Bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400">Message</span>
        <select className="bg-transparent text-white font-semibold px-1 py-0 focus:outline-none">
          <option>JSON</option>
          <option>RAW</option>
        </select>
        <button className="text-blue-500 flex items-center gap-1 font-semibold ml-2">
          <span className="material-icons" style={{ fontSize: 20 }}>send</span> Send
        </button>
        <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer ml-2">
          <input type="checkbox" className="accent-blue-600" /> Clear input
        </label>
        <button className="ml-2 text-gray-400 hover:text-white" title="Help">
          <span className="material-icons">help_outline</span>
        </button>
        <button className="text-gray-400 hover:text-white" title="Delete">
          <span className="material-icons">delete</span>
        </button>
        <button className="text-gray-400 hover:text-white" title="History">
          <span className="material-icons">history</span>
        </button>
        <button className="text-gray-400 hover:text-white" title="Format">
          <span className="material-icons">format_align_left</span>
        </button>
        <button className="text-gray-400 hover:text-white" title="Copy">
          <span className="material-icons">content_copy</span>
        </button>
      </div>
      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          language="json"
          theme="vs-dark"
          value={message}
          onChange={val => setMessage(val || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollbar: { vertical: 'auto' } }}
        />
      </div>
    </div>
  );
};

export default CommunicationTab; 