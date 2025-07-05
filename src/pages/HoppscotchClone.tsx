import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import InterceptorCard from '../components/settings/InterceptorCard';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'CUSTOM'];

const defaultTabData = () => ({
  id: uuidv4(),
  method: 'GET',
  tabName: 'Untitled',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'parameters',
  parameters: [],
  body: '',
  headers: [],
  authorization: '',
  preRequest: '',
  postRequest: '',
  variables: [],
});

// Simple unique ID generator for tabs
const uuidv4 = () => '_' + Math.random().toString(36).substr(2, 9);

const HoppscotchClone: React.FC = () => {
  const [tabs, setTabs] = useState([defaultTabData()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);
  const [envTab, setEnvTab] = useState<'personal' | 'workspace'>('personal');
  const [showVarsPopover, setShowVarsPopover] = useState(false);
  const [editModal, setEditModal] = useState<null | 'global' | 'environment'>('global');
  const eyeRef = React.useRef<HTMLSpanElement | null>(null);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const methodDropdownRef = React.useRef<HTMLDivElement>(null);
  const [showInterceptorInPanel, setShowInterceptorInPanel] = useState(false);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const sendMenuRef = React.useRef<HTMLDivElement>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveRequestName, setSaveRequestName] = useState('Untitled');
  const [showImportCurlModal, setShowImportCurlModal] = useState(false);
  const [curlInput, setCurlInput] = useState("");
  const [showGenerateCodeModal, setShowGenerateCodeModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Shell - cURL');
  const generatedCode = `curl --request GET \\n  --url https://echo.hoppscotch.io/`;
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const saveDropdownRef = React.useRef<HTMLDivElement>(null);

  // Helper to get the active tab object
  const activeTabObj = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const methodColors: Record<string, string> = {
    GET: '#10B981',
    POST: '#E3AE09',
    PUT: '#0EA4E8',
    PATCH: '#8B5CF6',
    DELETE: '#F43F5E',
    HEAD: '#14B8A6',
    OPTIONS: '#4F51AD',
    CONNECT: '#737373',
    TRACE: '#737373',
    CUSTOM: '#737373',
  };

  // Modal logic for renaming tab
  const openModal = () => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, modalValue: tab.tabName, showModal: true } : tab));
  };
  const closeModal = () => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, showModal: false } : tab));
  };
  const saveModal = () => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, tabName: tab.modalValue, showModal: false } : tab));
  };

  // Add new tab
  const addTab = () => {
    const newTab = defaultTabData();
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  // Switch tab
  const switchTab = (id: string) => setActiveTabId(id);

  // Update method for active tab
  const setMethod = (method: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, method } : tab));
  };

  // Update activeTab (Parameters, Body, etc.) for active tab
  const setActiveTab = (tab: string) => {
    setTabs(tabs => tabs.map(t => t.id === activeTabId ? { ...t, activeTab: tab } : t));
  };

  // Update modal value for renaming
  const setModalValue = (val: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, modalValue: val } : tab));
  };

  // Click-away handler for variable popover
  React.useEffect(() => {
    if (!showVarsPopover) return;
    function handleClick(e: MouseEvent) {
      if (
        eyeRef.current &&
        !eyeRef.current.contains(e.target as Node) &&
        !(document.getElementById('vars-popover')?.contains(e.target as Node))
      ) {
        setShowVarsPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showVarsPopover]);

  // Click-away handler for edit modal
  React.useEffect(() => {
    if (!editModal) return;
    function handleClick(e: MouseEvent) {
      if (!(document.getElementById('edit-env-modal')?.contains(e.target as Node))) {
        setEditModal(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [editModal]);

  // Close custom dropdown on outside click
  React.useEffect(() => {
    if (!methodDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        methodDropdownRef.current &&
        !methodDropdownRef.current.contains(e.target as Node)
      ) {
        setMethodDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [methodDropdownOpen]);

  // Close send menu on outside click
  React.useEffect(() => {
    if (!sendMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        sendMenuRef.current &&
        !sendMenuRef.current.contains(e.target as Node)
      ) {
        setSendMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sendMenuOpen]);

  // Close save dropdown on outside click
  React.useEffect(() => {
    if (!showSaveDropdown) return;
    function handleClick(e: MouseEvent) {
      if (
        saveDropdownRef.current &&
        !saveDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSaveDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSaveDropdown]);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 text-white">
      {/* Edit Environment Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60">
          <div id="edit-env-modal" className="mt-8 bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0">
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-8 pt-8 pb-4">
                <div className="text-2xl font-bold text-center w-full">Edit Environment</div>
                <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={() => setEditModal(null)}>&times;</button>
              </div>
              <div className="px-8 pb-4">
                <label className="block text-xs text-gray-400 mb-1">Label</label>
                <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4" value={editModal === 'global' ? 'Global' : 'Environment'} readOnly />
              </div>
              <div className="px-8 flex gap-6 border-b border-zinc-800">
                <button className="py-2 font-semibold border-b-2 border-blue-500 text-white">Variables</button>
                <button className="py-2 font-semibold text-zinc-400">Secrets</button>
              </div>
              <div className="px-8 py-8 flex flex-col items-center justify-center min-h-[200px]">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-40"><rect x="8" y="8" width="40" height="40" rx="8" fill="#232326"/><path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                <span className="text-zinc-400 text-sm mt-2 mb-4">Environments are empty</span>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
                  + Add new
                </button>
              </div>
              <div className="flex gap-4 justify-start px-8 pb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold" onClick={() => setEditModal(null)}>Save</button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={() => setEditModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top full-width bar */}
      <div className="w-full bg-[#1C1C1E] border-b h-10 border-zinc-800 relative">
        <div className="flex items-center h-full w-full">
          <div className="flex items-center flex-1 min-w-0">
            {/* Tab bar */}
            {tabs.map((tab) => (
              <TabContent
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onSwitchTab={() => switchTab(tab.id)}
                onCloseTab={e => {
                  e.stopPropagation();
                  setTabs(tabs => {
                    const idx = tabs.findIndex(t => t.id === tab.id);
                    const newTabs = tabs.filter(t => t.id !== tab.id);
                    if (tab.id === activeTabId && newTabs.length > 0) {
                      setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
                    }
                    return newTabs;
                  });
                }}
                canClose={tabs.length > 1}
                methodColors={methodColors}
              />
            ))}
            <span
              className="flex items-center justify-center h-12 w-10 -mt-1 rounded-t-md text-blue-500 text-2xl cursor-pointer hover:bg-[#232326] transition"
              onClick={addTab}
            >
              +
            </span>
          </div>
          <div className="flex items-center h-full px-4 rounded gap-2 min-w-[220px] relative">
            {/* Layers icon */}
            <button
              className="flex items-center h-full opacity-50 hover:opacity-100"
              onClick={() => setEnvDropdownOpen((v) => !v)}
              tabIndex={0}
            >
              {/* Group icon and text */}
              <div className="flex items-center gap-2   ">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 -2 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white  w-4 h-4">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
                  <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
                </svg>
                <span className="text-white text-[13px] font-medium mt-[1px]">Select environment</span>
              </div>

              {/* Chevron with left margin */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white ml-9 mt-1"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Eye icon with popover */}
            <span ref={eyeRef} className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-icon lucide-eye opacity-50 ml-7 hover:opacity-100 cursor-pointer"
                onClick={() => setShowVarsPopover(v => !v)}
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {showVarsPopover && (
                <div
                  id="vars-popover"
                  className="absolute z-50 mt-2 right-0 w-96 bg-[#18181A] rounded-xl shadow-2xl border border-zinc-800 p-0"
                  style={{ top: '100%' }}
                >
                  {/* Global variables section */}
                  <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-200 font-semibold text-base">Global variables</span>
                      <span className="cursor-pointer p-1 rounded hover:bg-zinc-800" onClick={() => setEditModal('global')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                      </span>
                    </div>
                    <div className="flex text-xs text-zinc-400 mb-1">
                      <div className="flex-1">Name</div>
                      <div className="flex-1">Initial value</div>
                      <div className="flex-1">Current value</div>
                    </div>
                    <div className="text-zinc-500 text-xs py-4 text-center">No variables</div>
                  </div>
                  {/* Environment variables section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-200 font-semibold text-base">Environment variables</span>
                      <span className="cursor-pointer p-1 rounded hover:bg-zinc-800" onClick={() => setEditModal('environment')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                      </span>
                    </div>
                    <div className="text-zinc-500 text-xs py-4 text-center">No active environment</div>
                  </div>
                </div>
              )}
            </span>
            {/* Dropdown card */}
            {envDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="absolute right-0 top-full mt-2 w-96 bg-[#18181A] rounded-xl shadow-2xl border border-zinc-800 z-50 p-4"
              >
                {/* Search */}
                <input
                  className="w-full bg-[#232326] border-none rounded px-3 py-2 text-white text-sm mb-4 placeholder-zinc-400 focus:outline-none"
                  placeholder="Search"
                />
                {/* No environment */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-200 text-sm font-medium">No environment</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L8.75 13.25L5 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {/* Tabs */}
                <div className="flex border-b border-zinc-700 mb-6">
                  <button
                    className={`flex-1 py-2 text-sm font-semibold ${envTab === 'personal' ? 'text-white border-b-2 border-blue-500' : 'text-zinc-400'}`}
                    onClick={() => setEnvTab('personal')}
                  >
                    Personal Environments
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-semibold ${envTab === 'workspace' ? 'text-white border-b-2 border-blue-500' : 'text-zinc-400'}`}
                    onClick={() => setEnvTab('workspace')}
                  >
                    Workspace Environments
                  </button>
                </div>
                {/* Empty state */}
                <div className="flex flex-col items-center justify-center py-8">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-40"><rect x="8" y="8" width="40" height="40" rx="8" fill="#232326"/><path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="text-zinc-400 text-sm mt-2">Environments are empty</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeTabObj.showModal && (
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
                    value={activeTabObj.modalValue}
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

      {/* Save as Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0 relative">
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div className="text-2xl font-bold text-center w-full">Save as</div>
              <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={() => setShowSaveModal(false)}>&times;</button>
            </div>
            <div className="px-8 pb-4">
              <label className="block text-xs text-gray-400 mb-1">Request name</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4"
                value={saveRequestName}
                onChange={e => setSaveRequestName(e.target.value)}
              />
              <label className="block text-xs text-gray-400 mb-1">Select location</label>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2">
                <div className="text-xs text-zinc-400 mb-2">Personal Workspace &gt; Collections</div>
                <input
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm mb-2"
                  placeholder="Search"
                />
                <div className="flex items-center gap-2 mb-2">
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-500 text-sm font-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m7-7H5"/></svg>
                    New
                  </button>
                  <button className="ml-auto text-zinc-400 hover:text-white" title="Help"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg></button>
                </div>
                <div className="flex flex-col items-center justify-center py-8">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-40"><rect x="8" y="8" width="40" height="40" rx="8" fill="#232326"/><path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="text-zinc-400 text-sm mt-2">Collections are empty</span>
                  <span className="text-zinc-500 text-xs mb-4">Import or create a collection</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    Import
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 pb-8 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">Save</button>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={() => setShowSaveModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Import cURL Modal */}
      {showImportCurlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0 relative">
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div className="text-2xl font-bold text-center w-full">Import cURL</div>
              <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={() => setShowImportCurlModal(false)}>&times;</button>
            </div>
            <div className="px-8 pb-4">
              <label className="block text-xs text-gray-400 mb-1">cURL</label>
              <div className="relative bg-zinc-900 rounded-lg border border-zinc-800">
                {/* Toolbar icons */}
                <div className="absolute right-2 top-2 flex gap-2 z-10">
                  <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg></button>
                  <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></button>
                  <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
                </div>
                <textarea
                  className="w-full h-32 bg-transparent text-white p-4 rounded-lg focus:outline-none resize-none placeholder-zinc-500 mt-6"
                  placeholder="Enter cURL command"
                  value={curlInput}
                  onChange={e => setCurlInput(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: 15 }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-8 pb-8 pt-4">
              <div className="flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold" onClick={() => setShowImportCurlModal(false)}>Import</button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={() => setShowImportCurlModal(false)}>Cancel</button>
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                Paste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate code Modal */}
      {showGenerateCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#18181A] rounded-2xl shadow-2xl border border-zinc-800 w-[600px] max-w-full p-0 relative">
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div className="text-2xl font-bold text-center w-full">Generate code</div>
              <button className="absolute right-8 top-8 text-gray-400 hover:text-white text-2xl" onClick={() => setShowGenerateCodeModal(false)}>&times;</button>
            </div>
            <div className="px-8 pb-4">
              <label className="block text-xs text-gray-400 mb-1">Choose language</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base mb-4"
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
              >
                <option>Shell - cURL</option>
                <option>Node.js - fetch</option>
                <option>Python - requests</option>
                <option>Go - http</option>
                <option>JavaScript - XMLHttpRequest</option>
              </select>
              <label className="block text-xs text-gray-400 mb-1">Generated code</label>
              <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                {/* Toolbar icons */}
                <div className="absolute right-2 top-2 flex gap-2 z-10">
                  <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
                  <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></button>
                  <button className="text-zinc-400 hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></button>
                </div>
                <pre className="text-white text-sm font-mono whitespace-pre mt-6">
{generatedCode}
                </pre>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 pb-8 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">Copy</button>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold" onClick={() => setShowGenerateCodeModal(false)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout below top bar */}
      <div className="flex flex-1">
        {/* Left Content */}
        <div className="flex flex-col flex-1 p-4 ">
          {/* URL bar */}
          <div className="flex items-center mb-4">
            <div className="relative" ref={methodDropdownRef}>
              <button
                type="button"
                className="font-bold px-2 py-1 h-9 rounded-l-sm border-s-0 border-opacity-5 focus:outline-none flex items-center w-24 relative"
                style={{ color: methodColors[activeTabObj.method] || '#737373', background: '#1B1B1B' }}
                onClick={() => setMethodDropdownOpen(v => !v)}
              >
                <span className="flex-1 text-left">{activeTabObj.method}</span>
                <span className="flex items-center justify-end" style={{ minWidth: 24 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </span>
              </button>
              {methodDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-32 max-h-64 rounded-md shadow-lg z-50 overflow-y-auto border border-zinc-800 bg-[#1B1B1B] scrollbar-hide"
                  style={{ top: '100%' }}
                >
                  {METHODS.map(m => (
                    <button
                      key={m}
                      className="w-full text-left px-4 py-2 font-bold hover:bg-[#232326] focus:outline-none"
                      style={{ color: methodColors[m] || '#737373', background: 'inherit' }}
                      onClick={() => {
                        setMethod(m);
                        setMethodDropdownOpen(false);
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              className="flex-1 bg-[#1B1B1B] rounded-r-sm  border-s-0 border-opacity-5 px-4 py-2 h-9 text-white focus:outline-none"
              placeholder="https://echo.hoppscotch.io"
              defaultValue="https://echo.hoppscotch.io"
            />
            <div className="relative flex">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-l-md font-semibold"
                onClick={() => {
                  setShowInterceptorInPanel(false);
                  setTimeout(() => setShowInterceptorInPanel(true), 1000);
                }}
              >
                Send
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-r-md font-semibold border-l border-blue-700"
                onClick={() => setSendMenuOpen(v => !v)}
                aria-label="Send options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {sendMenuOpen && (
                <div
                  ref={sendMenuRef}
                  className="absolute left-0 mt-2 w-56 bg-[#18181A] rounded-xl shadow-2xl border border-zinc-800 z-50 p-2"
                  style={{ top: '100%' }}
                >
                  <button
                    className="flex items-center w-full px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3"
                    onClick={() => {
                      setShowImportCurlModal(true);
                      setSendMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                    <span className="flex-1 text-left">Import cURL</span>
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">C</span>
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3"
                    onClick={() => {
                      setShowGenerateCodeModal(true);
                      setSendMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18 22 12 16 6"/><path d="M8 6 2 12l6 6"/></svg>
                    <span className="flex-1 text-left">Show code</span>
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">S</span>
                  </button>
                  <button className="flex items-center w-full px-3 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/><path d="M12 3v18"/></svg>
                    <span className="flex-1 text-left">Clear all</span>
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">⌫</span>
                  </button>
                </div>
              )}
            </div>
         

              <button className="bg-[#1C1C1E] hover:bg-[#262626] text-white px-4 py-2 rounded-l-md  font-semibold ml-4 h-10 " onClick={() => setShowSaveModal(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
              </button>
            <div className="relative inline-block">
              <button
                className="bg-[#1C1C1E] hover:bg-[#262626] text-white px-2 py-2 rounded-r-md font-semibold"
                onClick={() => setShowSaveDropdown(v => !v)}
                aria-label="Save options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {showSaveDropdown && (
                <div
                  ref={saveDropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-[#18181A] rounded-xl shadow-2xl border border-zinc-800 z-50 p-4"
                  style={{ top: '100%' }}
                >
                  <div className="mb-4">
                    <input
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-base font-semibold mb-2 text-center"
                      value={saveRequestName}
                      readOnly
                    />
                  </div>
                  <button className="flex items-center w-full px-2 py-2 rounded hover:bg-zinc-800 text-zinc-200 gap-3 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                    <span className="flex-1 text-left">Save as</span>
                  </button>
                  <hr className="my-2 border-zinc-800" />
                  <button className="flex items-center w-full px-2 py-2 rounded hover:bg-zinc-800 text-zinc-400 gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v2a2 2 0 0 0 2 2h2"/><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M16 12h2a2 2 0 0 1 2 2v2"/><path d="M8 16v2a2 2 0 0 0 2 2h2"/></svg>
                    <span className="flex-1 text-left">Share Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-800 mb-2">
            {['parameters', 'body', 'headers', 'authorization', 'pre-request', 'post-request', 'variables'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-1 font-semibold ${
                  activeTabObj.activeTab === tab
                    ? 'border-b-2 border-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Tab content area (example: Parameters) */}
          {activeTabObj.activeTab === 'parameters' && (
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
          )}
        </div>

        {/* Right Panel: Show InterceptorCard after Send */}
        <div className="w-1/3 flex flex-col items-center justify-center border-l border-gray-800 p-8">
          {showInterceptorInPanel ? (
            <InterceptorCard />
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

// TabContent component for tab UI
type TabContentProps = {
  tab: any;
  isActive: boolean;
  onSwitchTab: () => void;
  onCloseTab: (e: React.MouseEvent) => void;
  canClose: boolean;
  methodColors: Record<string, string>;
};
const TabContent: React.FC<TabContentProps> = ({ tab, isActive, onSwitchTab, onCloseTab, canClose, methodColors }) => (
  <div
    className={`group relative flex items-center h-12 px-0 cursor-pointer select-none font-bold bg-[#18181A] rounded-t-md -mt-1 shadow z-10 transition-all duration-200 ${isActive ? '' : 'opacity-60'}`}
    onClick={onSwitchTab}
  >
    {/* Blue bar at top for active tab */}
    {isActive && (
      <div className="absolute left-0 top-0 w-full h-1 bg-blue-500 rounded-t-md" style={{zIndex: 2}} />
    )}
    <div className="flex items-center w-36 overflow-hidden z-10 px-6">
      <span
        className="font-medium text-[13px] mr-2 whitespace-nowrap"
        style={{ color: methodColors[tab.method] || '#737373' }}
      >
        {tab.method}
      </span>
      <span className="text-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
        {tab.tabName}
      </span>
    </div>
    <div className="w-4 h-4 flex items-center justify-center relative">
      <span className={`w-2 h-2 rounded-full bg-gray-400 opacity-60 z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 ${canClose ? 'group-hover:opacity-0' : ''}`}></span>
      {canClose && (
        <button
          className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white z-10 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ pointerEvents: 'auto' }}
          onClick={onCloseTab}
          tabIndex={-1}
          title="Close tab"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  </div>
);

export default HoppscotchClone; 
