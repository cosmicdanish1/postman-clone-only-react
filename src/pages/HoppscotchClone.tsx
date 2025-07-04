import React, { useState } from 'react';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const HoppscotchClone: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [activeTab, setActiveTab] = useState('parameters');

  return (
    <div className="flex h-full w-full bg-black text-white">
      {/* Main content area */}
      <div className="flex flex-col flex-1 p-6">
        {/* Top bar */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-white px-2">Untitled</span>
          <span className="text-blue-500 text-2xl px-2 cursor-pointer">+</span>
        </div>
        {/* URL bar */}
        <div className="flex items-center gap-2 mb-4">
          <select
            className="bg-black text-green-400 font-bold px-2 py-1 rounded border-none focus:outline-none"
            value={method}
            onChange={e => setMethod(e.target.value)}
          >
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            className="flex-1 bg-gray-900 border-none rounded px-4 py-2 text-white focus:outline-none"
            placeholder="https://echo.hoppscotch.io"
            defaultValue="https://echo.hoppscotch.io"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Send</button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold">
            <span className="material-icons">save</span>
          </button>
          <div className="flex items-center gap-1 bg-black px-3 py-2 rounded cursor-pointer">
            <span className="material-icons text-gray-400">layers</span>
            <span className="text-gray-400 text-sm">Select environment</span>
            <span className="material-icons text-gray-400">expand_more</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-800 mb-2">
          <button onClick={() => setActiveTab('parameters')} className={`px-2 py-1 font-semibold ${activeTab === 'parameters' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Parameters</button>
          <button onClick={() => setActiveTab('body')} className={`px-2 py-1 font-semibold ${activeTab === 'body' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Body</button>
          <button onClick={() => setActiveTab('headers')} className={`px-2 py-1 font-semibold ${activeTab === 'headers' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Headers</button>
          <button onClick={() => setActiveTab('authorization')} className={`px-2 py-1 font-semibold ${activeTab === 'authorization' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Authorization</button>
          <button onClick={() => setActiveTab('pre-request')} className={`px-2 py-1 font-semibold ${activeTab === 'pre-request' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Pre-request Script</button>
          <button onClick={() => setActiveTab('post-request')} className={`px-2 py-1 font-semibold ${activeTab === 'post-request' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Post-request Script</button>
          <button onClick={() => setActiveTab('variables')} className={`px-2 py-1 font-semibold ${activeTab === 'variables' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Variables</button>
        </div>
        {/* Main area for query parameters */}
        <div className="flex-1 flex flex-col bg-gray-900 rounded p-4 mt-2">
          <div className="text-gray-400 mb-2">Query Parameters</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 flex-1">Key</span>
            <span className="text-gray-400 flex-1">Value</span>
            <span className="text-gray-400 flex-1">Description</span>
            <button className="text-gray-400 hover:text-white"><span className="material-icons">add</span></button>
          </div>
          {/* Example row */}
          <div className="flex items-center gap-2 mb-2">
            <input className="flex-1 bg-gray-800 border-none rounded px-2 py-1 text-white" placeholder="" />
            <input className="flex-1 bg-gray-800 border-none rounded px-2 py-1 text-white" placeholder="" />
            <input className="flex-1 bg-gray-800 border-none rounded px-2 py-1 text-white" placeholder="" />
            <button className="text-green-500"><span className="material-icons">check</span></button>
            <button className="text-red-500"><span className="material-icons">delete</span></button>
          </div>
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

export default HoppscotchClone; 