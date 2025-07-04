import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const HoppscotchClone: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [activeTab, setActiveTab] = useState('parameters');
  const [tabName, setTabName] = useState('Untitled');
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState(tabName);

  const methodColors: Record<string, string> = {
    GET: 'text-green-400',
    POST: 'text-blue-400',
    PUT: 'text-yellow-400',
    DELETE: 'text-red-400',
    PATCH: 'text-purple-400',
  };

  const openModal = () => {
    setModalValue(tabName);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const saveModal = () => {
    setTabName(modalValue);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 text-white">
      {/* Top full-width bar */}
      <div className="w-full bg-[#1C1C1E] border-b border-zinc-800">
        <div className="flex items-center gap-1 px-4 py-2">
          <div
            className={`relative px-4 py-2 bg-neutral-900 font-bold cursor-pointer select-none flex items-center`}
            onClick={openModal}
          >
            <div className="absolute left-0 top-0 w-full h-[2px] bg-blue-500" />
            <div className="flex items-center w-28 overflow-hidden">
              <span className={`${methodColors[method] || 'text-white'} font-medium text-[13px] mr-2 mt-1 whitespace-nowrap`}>
                {method}
              </span>
              <span className="text-xs pt-1 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {tabName}
              </span>
            </div>
            <span className=" ml-10 w-2 h-2 mt-2 rounded-full bg-gray-400 inline-block opacity-60"></span>
          </div>
          <span className="text-blue-500 text-2xl px-2 cursor-pointer">+</span>
          {/* Right-aligned environment selector bar */}
          <div className="flex items-center px-4 py-2 rounded gap-2 ml-auto min-w-[220px]">
            {/* Layers icon */}
          
           {/* <div className='flex gap-2'>
            <span className="text-white text-sm font-medium opacity-50 hover:opacity-100">Select environment</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down opacity-50 hover:opacity-100"><path d="m6 9 6 6 6-6"/></svg>
            
            </div>  */}

            <button className='flex gap-1 opacity-50 hover:opacity-100'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 -2 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white "><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></svg>    
            <span className="text-white text-sm font-medium ">Select environment</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down "><path d="m6 9 6 6 6-6"/></svg>
            
           
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-icon lucide-eye hover:opacity-100"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md relative border border-zinc-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="text-2xl font-bold text-center mb-6">Edit Request</div>
              <div className="mb-6">
                <label className="block text-xs text-gray-400 mb-1">Label</label>
                <div className="flex items-center bg-zinc-800 rounded px-3 py-2">
                  <input
                    className="flex-1 bg-transparent border-none outline-none text-white text-lg"
                    value={modalValue}
                    onChange={e => setModalValue(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-start mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                  onClick={saveModal}
                >
                  Save
                </button>
                <button
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout below top bar */}
      <div className="flex flex-1">
        {/* Left Content */}
        <div className="flex flex-col flex-1 p-4">
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
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-2">
            {['parameters', 'body', 'headers', 'authorization', 'pre-request', 'post-request', 'variables'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-1 font-semibold ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Parameters section */}
          <div className="flex-1 flex flex-col bg-gray-900 rounded p-4 mt-2">
            <div className="text-gray-400 mb-2">Query Parameters</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 flex-1">Key</span>
              <span className="text-gray-400 flex-1">Value</span>
              <span className="text-gray-400 flex-1">Description</span>
              <button className="text-gray-400 hover:text-white"><span className="material-icons">add</span></button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input className="flex-1 bg-gray-800 border-none rounded px-2 py-1 text-white" />
              <input className="flex-1 bg-gray-800 border-none rounded px-2 py-1 text-white" />
              <input className="flex-1 bg-gray-800 border-none rounded px-2 py-1 text-white" />
              <button className="text-green-500"><span className="material-icons">check</span></button>
              <button className="text-red-500"><span className="material-icons">delete</span></button>
            </div>
          </div>
        </div>

        {/* Right Shortcuts Panel */}
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
    </div>
  );
};

export default HoppscotchClone;
