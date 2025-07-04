import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

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

// SortableTab component for drag-and-drop
type SortableTabProps = { id: string; children: (listeners: any) => React.ReactNode };
function SortableTab({ id, children }: SortableTabProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} className="inline-block align-top m-0 p-0">
      {children(listeners)}
    </div>
  );
}

const HoppscotchClone: React.FC = () => {
  const [tabs, setTabs] = useState([defaultTabData()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);
  const [envTab, setEnvTab] = useState<'personal' | 'workspace'>('personal');

  // Helper to get the active tab object
  const activeTabObj = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const methodColors: Record<string, string> = {
    GET: 'text-green-400',
    POST: 'text-blue-400',
    PUT: 'text-yellow-400',
    DELETE: 'text-red-400',
    PATCH: 'text-purple-400',
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

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 text-white">
      {/* Top full-width bar */}
      <div className="w-full bg-[#1C1C1E] border-b h-10 border-zinc-800 relative">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (over && active.id !== over.id) {
              setTabs((tabs) => {
                const oldIndex = tabs.findIndex(t => t.id === active.id);
                const newIndex = tabs.findIndex(t => t.id === over.id);
                return arrayMove(tabs, oldIndex, newIndex);
              });
            }
          }}
        >
          <SortableContext items={tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
            <div className="flex items-center py-2">
              {/* Tab bar */}
              {tabs.map((tab) => (
                <SortableTab key={tab.id} id={tab.id}>
                  {(dragListeners) => (
                    <TabContent
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
                      dragListeners={dragListeners}
                    />
                  )}
                </SortableTab>
              ))}
              <span
                className="flex items-center justify-center h-12 w-10 ml-0 rounded-t-md text-blue-500 text-2xl cursor-pointer hover:bg-[#232326] transition"
                style={{ marginLeft: 0 }}
                onClick={addTab}
              >
                +
              </span>
              {/* Right-aligned environment selector bar */}
              <div className="relative flex items-center px-4 py-2 rounded gap-2 ml-auto min-w-[220px]">
                {/* Layers icon */}
                <button
                  className="flex items-center opacity-50 hover:opacity-100"
                  onClick={() => setEnvDropdownOpen((v) => !v)}
                  tabIndex={0}
                >
                  {/* Group icon and text */}
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 -2 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
                      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
                    </svg>
                    <span className="text-white text-sm font-medium">Select environment</span>
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
                    className="text-white ml-2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye opacity-50 ml-4 hover:opacity-100"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
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
          </SortableContext>
        </DndContext>
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

      {/* Main layout below top bar */}
      <div className="flex flex-1">
        {/* Left Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* URL bar */}
          <div className="flex items-center gap-2 mb-4">
            <select
              className="bg-black text-green-400 font-bold px-2 py-1 rounded border-none focus:outline-none"
              value={activeTabObj.method}
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

// TabContent component for tab UI
type TabContentProps = {
  tab: any;
  isActive: boolean;
  onSwitchTab: () => void;
  onCloseTab: (e: React.MouseEvent) => void;
  canClose: boolean;
  methodColors: Record<string, string>;
  dragListeners: any;
};
const TabContent: React.FC<TabContentProps> = ({ tab, isActive, onSwitchTab, onCloseTab, canClose, methodColors, dragListeners }) => (
  <div
    className={`group relative flex items-center h-12 px-0 cursor-pointer select-none font-bold bg-[#18181A] rounded-t-md -mt-2.5 shadow z-10 transition-all duration-200 ${isActive ? '' : 'opacity-60'}`}
    onClick={onSwitchTab}
    {...dragListeners}
  >
    {/* Blue bar at top for active tab */}
    {isActive && (
      <div className="absolute left-0 top-0 w-full h-1 bg-blue-500 rounded-t-md" style={{zIndex: 2}} />
    )}
    <div className="flex items-center w-36 overflow-hidden z-10 px-6">
      <span className={`${methodColors[tab.method] || 'text-white'} font-medium text-[13px] mr-2 whitespace-nowrap`}>
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
