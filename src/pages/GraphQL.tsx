import React, { useState } from 'react';

const GraphQL: React.FC = () => {
  const [activeTab, setActiveTab] = useState('query');

  return (
    <div className="flex h-full w-full bg-black text-white">
      {/* Main content area */}
      <div className="flex flex-col flex-1 p-6">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-4">
          <input
            className="flex-1 bg-gray-900 border-none rounded px-4 py-2 text-white focus:outline-none"
            placeholder="https://echo.hoppscotch.io/graphql"
            defaultValue="https://echo.hoppscotch.io/graphql"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
        </div>
        {/* Tabs (Untitled, +) */}
        <div className="flex items-center gap-2 border-b border-gray-800 mb-2">
          <button className="px-4 py-2 font-bold border-b-2 border-blue-500">Untitled</button>
          <button className="px-4 py-2 text-gray-400 text-xl">+</button>
        </div>
        {/* Query/Variables/Headers/Authorization Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-800 mb-2">
          <button onClick={() => setActiveTab('query')} className={`px-2 py-1 font-semibold ${activeTab === 'query' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Query</button>
          <button onClick={() => setActiveTab('variables')} className={`px-2 py-1 font-semibold ${activeTab === 'variables' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Variables</button>
          <button onClick={() => setActiveTab('headers')} className={`px-2 py-1 font-semibold ${activeTab === 'headers' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Headers</button>
          <button onClick={() => setActiveTab('authorization')} className={`px-2 py-1 font-semibold ${activeTab === 'authorization' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Authorization</button>
        </div>
        {/* Code editor area */}
        <div className="flex-1 flex flex-col bg-gray-900 rounded p-4 mt-2">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500 font-semibold">Query</span>
            <button className="text-blue-500 flex items-center gap-1"><span className="material-icons">play_arrow</span>Request</button>
            <button className="text-gray-400 flex items-center gap-1"><span className="material-icons">save</span>Save</button>
            <button className="text-gray-400 flex items-center gap-1"><span className="material-icons">help_outline</span></button>
            <button className="text-gray-400 flex items-center gap-1"><span className="material-icons">delete</span></button>
            <button className="text-gray-400 flex items-center gap-1"><span className="material-icons">format_align_left</span></button>
            <button className="text-gray-400 flex items-center gap-1"><span className="material-icons">content_copy</span></button>
          </div>
          {/* Code area */}
          <pre className="flex-1 bg-transparent text-white font-mono text-base p-0 m-0">
{`query Request {
  method
  url
  headers {
    key
    value
  }
}`}
          </pre>
        </div>
      </div>
      {/* Right Help/Shortcuts Panel */}
      <div className="w-1/3 flex flex-col items-center justify-center border-l border-gray-800 p-8">
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Send Request</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl ↵</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Keyboard shortcuts</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl /</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Search & command menu</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">Ctrl K</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Help menu</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">?</span>
          </div>
          <a
            href="#"
            className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default GraphQL; 