import React, { useState, useRef, useLayoutEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiHelpCircle, FiTrash2, FiEdit2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import MonacoEditor from '@monaco-editor/react';

interface Variable {
  id: string;
  name: string;
  value: string;
  description: string;
}

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  locked: boolean;
}

function uuidv4() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

const defaultTabData = () => ({
  id: uuidv4(),
  tabName: 'Untitled',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'headers',
  query: '',
  variables: '',
  headers: [
    { id: uuidv4(), key: '', value: '', description: '' }
  ],
});

const GraphQL: React.FC = () => {
  const [tabs, setTabs] = useState([defaultTabData()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [hoveredCloseId, setHoveredCloseId] = useState<string | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const barRef = useRef<HTMLDivElement | null>(null);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

  // Modal logic for renaming tab
  const openModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, modalValue: tab.tabName, showModal: true } : tab));
  };
  const closeModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, showModal: false } : tab));
  };
  const saveModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, tabName: tab.modalValue, showModal: false } : tab));
  };
  const setModalValue = (id: string, val: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, modalValue: val } : tab));
  };

  // Add new tab
  const addTab = () => {
    const newTab = defaultTabData();
    setTabs(prev => {
      setTimeout(() => setActiveTabId(newTab.id), 0); // ensure DOM update
      return [...prev, newTab];
    });
  };

  // Switch tab
  const switchTab = (id: string) => setActiveTabId(id);

  // Close tab
  const closeTab = (id: string) => {
    setTabs(tabs => {
      const idx = tabs.findIndex(t => t.id === id);
      const newTabs = tabs.filter(t => t.id !== id);
      if (id === activeTabId && newTabs.length > 0) {
        setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
      }
      return newTabs;
    });
  };

  // Tab content state handlers
  const updateTab = (id: string, field: string, value: any) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, [field]: value } : tab));
  };

  // Header handlers for active tab
  const addHeader = () => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, headers: [...tab.headers, { id: uuidv4(), key: '', value: '', description: '' }] }
        : tab
    ));
  };
  const updateHeader = (headerId: string, field: string, value: string) => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, headers: tab.headers.map(h => h.id === headerId ? { ...h, [field]: value } : h) }
        : tab
    ));
  };
  const deleteHeader = (headerId: string) => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, headers: tab.headers.filter(h => h.id !== headerId) }
        : tab
    ));
  };

  // Get active tab object
  const activeTabObj = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  // Animate blue bar on tab change
  useLayoutEffect(() => {
    const el = tabRefs.current[activeTabId];
    if (el) {
      const { left, width } = el.getBoundingClientRect();
      const parentLeft = el.parentElement?.getBoundingClientRect().left || 0;
      setBarStyle({ left: left - parentLeft, width });
    }
  }, [activeTabId, tabs.length]);

  return (
    <div className="flex h-full w-full bg-[#18181b] text-white">
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <div className="flex items-center gap-4 p-4 border-b border-[#232329]">
          <input
            className="flex-1 bg-[#232329] border-none rounded px-4 py-2 text-white focus:outline-none"
            placeholder="https://echo.hoppscotch.io/graphql"
            defaultValue="https://echo.hoppscotch.io/graphql"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
        </div>
        {/* Tab bar */}
        <div className="w-full bg-[#1C1C1E] border-b h-10 border-zinc-800 relative flex items-center overflow-x-auto">
          <div className="flex items-center flex-1 min-w-0 relative" style={{ position: 'relative' }}>
            {/* Animated blue bar on top */}
            <div
              ref={barRef}
              style={{
                position: 'absolute',
                top: 0,
                left: barStyle.left,
                width: barStyle.width,
                height: 3,
                background: '#3b82f6',
                borderRadius: '3px 3px 0 0',
                transition: 'left 0.25s cubic-bezier(.4,1,.4,1), width 0.25s cubic-bezier(.4,1,.4,1)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
            {tabs.map(tab => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  ref={el => (tabRefs.current[tab.id] = el)}
                  className={`flex items-center h-10 cursor-pointer select-none border-b-2 transition relative group ${isActive ? 'bg-[#18181b] text-white font-bold' : 'border-transparent text-gray-400 hover:text-white'}`}
                  style={{ minWidth: 160, maxWidth: 240, width: 200, paddingLeft: 24, paddingRight: 24 }}
                  onClick={() => switchTab(tab.id)}
                  onDoubleClick={() => openModal(tab.id)}
                  onMouseEnter={() => setHoveredTabId(tab.id)}
                  onMouseLeave={() => { setHoveredTabId(null); setHoveredCloseId(null); }}
                >
                  <span className="truncate max-w-[120px]" style={{ zIndex: 20, position: 'relative' }}>{tab.tabName}</span>
                  {tabs.length > 1 && (
                    <span
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5"
                      style={{ zIndex: 20 }}
                      onMouseEnter={e => { e.stopPropagation(); setHoveredCloseId(tab.id); }}
                      onMouseLeave={e => { e.stopPropagation(); setHoveredCloseId(null); }}
                      onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                    >
                      {hoveredTabId === tab.id ? (
                        hoveredCloseId === tab.id ? (
                          <svg width="16" height="16" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-500 opacity-70 group-hover:opacity-100 transition" />
                        )
                      ) : null}
                    </span>
                  )}
                  {/* Rename modal */}
                  {tab.showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-[#18181b] rounded-2xl shadow-2xl border border-zinc-800 w-[400px] max-w-full p-0 relative">
                        {/* Title and close */}
                        <div className="flex items-center justify-center pt-6 pb-2 px-6 relative">
                          <div className="text-xl font-bold text-center flex-1">Edit Request</div>
                          <button className="absolute right-6 top-6 text-gray-400 hover:text-white text-2xl" onClick={() => closeModal(tab.id)}>&times;</button>
                        </div>
                        {/* Label and input */}
                        <div className="px-6 pb-2 pt-2">
                          <label className="block text-xs text-gray-400 mb-1">Label</label>
                          <div className="relative">
                            <input
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-white text-base pr-10 focus:outline-none"
                              value={tab.modalValue}
                              onChange={e => setModalValue(tab.id, e.target.value)}
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Enter') saveModal(tab.id); if (e.key === 'Escape') closeModal(tab.id); }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
                            </span>
                          </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex gap-3 justify-start px-6 pb-6 pt-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold text-base" onClick={() => saveModal(tab.id)}>Save</button>
                          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold text-base" onClick={() => closeModal(tab.id)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <span
              className="flex items-center justify-center h-10 w-10 text-blue-500 text-2xl cursor-pointer hover:bg-[#232326] transition rounded-t-md"
              onClick={addTab}
              style={{ zIndex: 20 }}
            >
              <FiPlus />
            </span>
          </div>
        </div>
        {/* Secondary tab bar */}
        <div className="flex items-center gap-6 border-b border-[#232329] px-4 bg-[#18181b]">
          <button onClick={() => updateTab(activeTabId, 'activeTab', 'query')} className={`px-2 py-3 font-semibold border-b-2 ${activeTabObj.activeTab === 'query' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Query</button>
          <button onClick={() => updateTab(activeTabId, 'activeTab', 'variables')} className={`px-2 py-3 font-semibold border-b-2 ${activeTabObj.activeTab === 'variables' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Variables</button>
          <button onClick={() => updateTab(activeTabId, 'activeTab', 'headers')} className={`px-2 py-3 font-semibold border-b-2 ${activeTabObj.activeTab === 'headers' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Headers</button>
          <button onClick={() => updateTab(activeTabId, 'activeTab', 'authorization')} className={`px-2 py-3 font-semibold border-b-2 ${activeTabObj.activeTab === 'authorization' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>Authorization</button>
        </div>
        {/* Tab Content */}
        <div className="flex flex-1">
          {/* Left: Tab content */}
          <div className="flex-1 p-0">
            {activeTabObj.activeTab === 'headers' && (
              <div className="p-0">
                {/* Headers Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#232329]">
                  <span className="font-semibold text-gray-200">Headers</span>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white"><FiHelpCircle size={18} /></button>
                    <button className="text-gray-400 hover:text-white"><FiTrash2 size={18} /></button>
                    <button className="text-gray-400 hover:text-white"><FiEdit2 size={18} /></button>
                    <button onClick={addHeader} className="text-gray-400 hover:text-white"><FiPlus size={18} /></button>
                  </div>
                </div>
                {/* Headers Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-400">
                    <thead>
                      <tr className="border-b border-[#232329]">
                        <th className="px-4 py-2 font-normal text-left">Key</th>
                        <th className="px-4 py-2 font-normal text-left">Value</th>
                        <th className="px-4 py-2 font-normal text-left">Description</th>
                        <th className="px-2 py-2 font-normal text-left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTabObj.headers.map((header, idx) => (
                        <tr key={header.id} className="border-b border-[#232329] hover:bg-[#232329]">
                          <td className="px-4 py-2"><input value={header.key} onChange={e => updateHeader(header.id, 'key', e.target.value)} className="bg-transparent w-full outline-none text-white" placeholder="" /></td>
                          <td className="px-4 py-2"><input value={header.value} onChange={e => updateHeader(header.id, 'value', e.target.value)} className="bg-transparent w-full outline-none text-white" placeholder="" /></td>
                          <td className="px-4 py-2"><input value={header.description} onChange={e => updateHeader(header.id, 'description', e.target.value)} className="bg-transparent w-full outline-none text-white" placeholder="" /></td>
                          <td className="px-2 py-2 flex gap-2 items-center">
                            <button className="text-green-500 hover:text-green-400"><FiCheck /></button>
                            <button onClick={() => deleteHeader(header.id)} className="text-red-500 hover:text-red-400"><FiTrash2 /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTabObj.activeTab === 'query' && (
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
                <div className="flex-1 flex px-4 pb-0 bg-neutral-900 rounded min-h-0">
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
                    value={activeTabObj.query || `query Request {\n  method\n  url\n  headers {\n    key\n    value\n  }\n}`}
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
                    onChange={val => updateTab(activeTabId, 'query', val || '')}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Right: Help/Shortcuts Panel */}
          <div className="w-1/3 flex flex-col items-center justify-center border-l border-[#232329] p-8">
            <div className="flex flex-col gap-4 items-start">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Send Request</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">Ctrl</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">↵</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Keyboard shortcuts</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">Ctrl</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Search & command menu</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">Ctrl</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">K</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Help menu</span>
                <span className="bg-[#232329] px-2 py-1 rounded text-xs">?</span>
              </div>
              <a
                href="#"
                className="mt-4 bg-[#232329] hover:bg-[#232329]/80 text-white px-4 py-2 rounded font-semibold text-center border border-[#232329]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation <span className="inline-block align-middle ml-1"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14m-7 7h7v-7" /></svg></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sortable Variable Row Component
const SortableVariableRow: React.FC<{
  variable: Variable;
  onUpdate: (id: string, field: keyof Variable, value: string) => void;
  onDelete: (id: string) => void;
}> = ({ variable, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variable.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-gray-800 rounded cursor-move hover:bg-gray-700"
    >
      <div className="text-gray-400 cursor-move">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <input
        type="text"
        value={variable.name}
        onChange={(e) => onUpdate(variable.id, 'name', e.target.value)}
        placeholder="Variable name"
        className="flex-1 bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        value={variable.value}
        onChange={(e) => onUpdate(variable.id, 'value', e.target.value)}
        placeholder="Variable value"
        className="flex-1 bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        value={variable.description}
        onChange={(e) => onUpdate(variable.id, 'description', e.target.value)}
        placeholder="Description"
        className="flex-1 bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => onDelete(variable.id)}
        className="text-red-400 hover:text-red-300 p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default GraphQL; 