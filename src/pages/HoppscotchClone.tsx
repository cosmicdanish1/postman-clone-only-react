import React, { useState, useRef } from 'react';
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
  headers: [
    { id: uuidv4(), key: '', value: '', description: '', locked: false },
    { id: uuidv4(), key: 'content type', value: '', description: '', locked: true }
  ],
  authorization: '',
  preRequest: '',
  postRequest: '',
  variables: [],
});

// Simple unique ID generator for tabs and params
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

  // Query Parameters state and handlers
  const [queryParams, setQueryParams] = React.useState([
    { id: uuidv4(), key: '', value: '', description: '' }
  ]);
  const [focusedRow, setFocusedRow] = React.useState<string | null>(null);

  // Add state for edit button active
  const [editActive, setEditActive] = useState(false);

  // Content type options for Body tab
  const contentTypeOptions = [
    { label: 'None', value: 'none' },
    { label: 'Text', value: 'text', isSection: true },
    { label: 'application/json', value: 'application/json' },
    { label: 'application/ld+json', value: 'application/ld+json' },
    { label: 'application/hal+json', value: 'application/hal+json' },
    { label: 'application/vnd.api+json', value: 'application/vnd.api+json' },
    { label: 'application/xml', value: 'application/xml' },
    { label: 'text/xml', value: 'text/xml' },
    { label: 'Structured', value: 'structured', isSection: true },
    { label: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded' },
    { label: 'multipart/form-data', value: 'multipart/form-data' },
    { label: 'Binary', value: 'binary', isSection: true },
    { label: 'application/octet-stream', value: 'application/octet-stream' },
    { label: 'Others', value: 'others', isSection: true },
    { label: 'text/html', value: 'text/html' },
    { label: 'text/plain', value: 'text/plain' },
  ];
  const [contentType, setContentType] = useState('none');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Add custom style for hiding scrollbar
  const hideScrollbarStyle: React.CSSProperties = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
    overflowY: 'auto',
  };

  const handleParamChange = (id: string, field: 'key' | 'value' | 'description', value: string) => {
    setQueryParams(prev => {
      const updated = prev.map((p) => p.id === id ? { ...p, [field]: value } : p);
      // If editing the last row's key and it's non-empty, add a new row with a stable id
      if (field === 'key' && prev[prev.length - 1].id === id && value.trim() !== '') {
        return [...updated, { id: uuidv4(), key: '', value: '', description: '' }];
      }
      return updated;
    });
  };
  const handleDeleteParam = (id: string) => {
    setQueryParams(prev => prev.length === 1 ? prev : prev.filter((p) => p.id !== id));
  };

  // Drag and drop handlers for Query Parameters
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQueryParams((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Sortable row component for Query Parameters (memoized, outside main component)
  const SortableParamRow = React.memo(function SortableParamRow({ param, handleParamChange, handleDeleteParam, setFocusedRow, isOdd }: {
    param: any,
    handleParamChange: (id: string, field: 'key' | 'value' | 'description', value: string) => void,
    handleDeleteParam: (id: string) => void,
    setFocusedRow: (id: string) => void,
    isOdd: boolean,
  }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: param.id });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          background: isOdd ? '#19191b' : undefined,
          minHeight: '38px',
          display: 'grid',
          gridTemplateColumns: '32px 1fr 1fr 1fr auto',
          borderBottom: '1px solid #27272a',
          paddingLeft: 0,
          paddingRight: 8,
          alignItems: 'center',
        }}
        className="px-2 group"
      >
        {/* Drag handle: 6-dot rectangle, only visible on hover */}
        <button
          {...attributes}
          {...listeners}
          className="flex items-center justify-center cursor-grab focus:outline-none h-full"
          style={{ background: 'none', border: 'none', padding: 0 }}
          tabIndex={-1}
          title="Drag to reorder"
        >
          <span className="inline-block opacity-0 group-hover:opacity-70 transition-opacity duration-150">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="4" r="1" fill="#888" />
              <circle cx="7" cy="4" r="1" fill="#888" />
              <circle cx="11" cy="4" r="1" fill="#888" />
              <circle cx="3" cy="9" r="1" fill="#888" />
              <circle cx="7" cy="9" r="1" fill="#888" />
              <circle cx="11" cy="9" r="1" fill="#888" />
            </svg>
          </span>
        </button>
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={param.key}
          placeholder="Key"
          onChange={e => handleParamChange(param.id, 'key', e.target.value)}
          onFocus={() => setFocusedRow(param.id)}
        />
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={param.value}
          placeholder="Value"
          onChange={e => handleParamChange(param.id, 'value', e.target.value)}
        />
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={param.description}
          placeholder="Description"
          onChange={e => handleParamChange(param.id, 'description', e.target.value)}
        />
        <div className="flex items-center gap-2 justify-end px-2">
          <button className="text-green-500 hover:text-green-400" tabIndex={-1}>
            <span className="material-icons">check_circle</span>
          </button>
          <button className="text-red-500 hover:text-red-400" onClick={() => handleDeleteParam(param.id)} tabIndex={-1}>
            <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
    );
  });

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

  // State for code editor content
  const [rawBody, setRawBody] = useState('');

  // State for x-www-form-urlencoded body parameters
  const [bodyParams, setBodyParams] = useState([
    { id: uuidv4(), key: '', value: '' }
  ]);
  const handleBodyParamChange = (id: string, field: 'key' | 'value', value: string) => {
    setBodyParams(prev => {
      const updated = prev.map((p) => p.id === id ? { ...p, [field]: value } : p);
      // If editing the last row's key and it's non-empty, add a new row
      if (field === 'key' && prev[prev.length - 1].id === id && value.trim() !== '') {
        return [...updated, { id: uuidv4(), key: '', value: '' }];
      }
      return updated;
    });
  };
  const handleDeleteBodyParam = (id: string) => {
    setBodyParams(prev => prev.length === 1 ? prev : prev.filter((p) => p.id !== id));
  };
  const handleAddBodyParam = () => {
    setBodyParams(prev => [...prev, { id: uuidv4(), key: '', value: '' }]);
  };

  // Drag and drop handlers for bodyParams
  const handleBodyDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBodyParams((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Sortable row component for bodyParams
  const SortableBodyParamRow = React.memo(function SortableBodyParamRow({ param, handleBodyParamChange, handleDeleteBodyParam, isOdd }: {
    param: { id: string; key: string; value: string };
    handleBodyParamChange: (id: string, field: 'key' | 'value', value: string) => void;
    handleDeleteBodyParam: (id: string) => void;
    isOdd: boolean;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: param.id });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          background: isOdd ? '#19191b' : undefined,
          minHeight: '38px',
          display: 'grid',
          gridTemplateColumns: '32px 1fr 1fr auto',
          borderBottom: '1px solid #27272a',
          paddingLeft: 0,
          paddingRight: 8,
          alignItems: 'center',
        }}
        className="px-2 group"
      >
        {/* Drag handle: 6-dot rectangle, only visible on hover */}
        <button
          {...attributes}
          {...listeners}
          className="flex items-center justify-center cursor-grab focus:outline-none h-full"
          style={{ background: 'none', border: 'none', padding: 0 }}
          tabIndex={-1}
          title="Drag to reorder"
        >
          <span className="inline-block opacity-0 group-hover:opacity-70 transition-opacity duration-150">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="4" r="1" fill="#888" />
              <circle cx="7" cy="4" r="1" fill="#888" />
              <circle cx="11" cy="4" r="1" fill="#888" />
              <circle cx="3" cy="9" r="1" fill="#888" />
              <circle cx="7" cy="9" r="1" fill="#888" />
              <circle cx="11" cy="9" r="1" fill="#888" />
            </svg>
          </span>
        </button>
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={param.key}
          placeholder="Parameter"
          onChange={e => handleBodyParamChange(param.id, 'key', e.target.value)}
        />
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={param.value}
          placeholder="Value"
          onChange={e => handleBodyParamChange(param.id, 'value', e.target.value)}
        />
        <div className="flex items-center gap-2 justify-end px-2">
          <button className="text-green-500 hover:text-green-400" tabIndex={-1}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
          </button>
          <button className="text-red-500 hover:text-red-400" onClick={() => handleDeleteBodyParam(param.id)} tabIndex={-1}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    );
  });

  // State for multipart/form-data body parameters
  const [multipartBodyParams, setMultipartBodyParams] = useState([
    { id: uuidv4(), key: '', value: '', contentType: '', file: null as File | null }
  ]);
  const [showMultipartContentType, setShowMultipartContentType] = useState(false);
  const handleMultipartBodyParamChange = (id: string, field: 'key' | 'value' | 'contentType', value: string) => {
    setMultipartBodyParams(prev => {
      const updated = prev.map((p) => p.id === id ? { ...p, [field]: value } : p);
      if (field === 'key' && prev[prev.length - 1].id === id && value.trim() !== '') {
        return [...updated, { id: uuidv4(), key: '', value: '', contentType: '', file: null }];
      }
      return updated;
    });
  };
  const handleMultipartFileChange = (id: string, file: File | null) => {
    setMultipartBodyParams(prev => prev.map((p) => p.id === id ? { ...p, file, value: file ? file.name : '' } : p));
  };
  const handleMultipartContentTypeChange = (id: string, value: string) => {
    setMultipartBodyParams(prev => prev.map((p) => p.id === id ? { ...p, contentType: value } : p));
  };
  const handleDeleteMultipartBodyParam = (id: string) => {
    setMultipartBodyParams(prev => prev.length === 1 ? prev : prev.filter((p) => p.id !== id));
  };
  const handleAddMultipartBodyParam = () => {
    setMultipartBodyParams(prev => [...prev, { id: uuidv4(), key: '', value: '', contentType: '', file: null }]);
  };
  const handleMultipartBodyDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setMultipartBodyParams((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  type SortableMultipartBodyParamRowProps = {
    param: {
      id: string;
      key: string;
      value: string;
      contentType: string;
      file: File | null;
    };
    handleMultipartBodyParamChange: (id: string, field: 'key' | 'value' | 'contentType', value: string) => void;
    handleDeleteMultipartBodyParam: (id: string) => void;
    handleMultipartFileChange: (id: string, file: File | null) => void;
    handleMultipartContentTypeChange: (id: string, value: string) => void;
    isOdd: boolean;
    showContentType: boolean;
  };
  const SortableMultipartBodyParamRow = React.memo(function SortableMultipartBodyParamRow({ param, handleMultipartBodyParamChange, handleDeleteMultipartBodyParam, handleMultipartFileChange, handleMultipartContentTypeChange, isOdd, showContentType }: SortableMultipartBodyParamRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: param.id });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          background: isOdd ? '#19191b' : undefined,
          minHeight: '38px',
          display: 'grid',
          gridTemplateColumns: showContentType ? '32px 1fr 1fr 1fr auto' : '32px 1fr 1fr auto',
          borderBottom: '1px solid #27272a',
          paddingLeft: 0,
          paddingRight: 8,
          alignItems: 'center',
        }}
        className="px-2 group"
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex items-center justify-center cursor-grab focus:outline-none h-full"
          style={{ background: 'none', border: 'none', padding: 0 }}
          tabIndex={-1}
          title="Drag to reorder"
        >
          <span className="inline-block opacity-0 group-hover:opacity-70 transition-opacity duration-150">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="4" r="1" fill="#888" />
              <circle cx="7" cy="4" r="1" fill="#888" />
              <circle cx="11" cy="4" r="1" fill="#888" />
              <circle cx="3" cy="9" r="1" fill="#888" />
              <circle cx="7" cy="9" r="1" fill="#888" />
              <circle cx="11" cy="9" r="1" fill="#888" />
            </svg>
          </span>
        </button>
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={param.key}
          placeholder="Parameter"
          onChange={e => handleMultipartBodyParamChange(param.id, 'key', e.target.value)}
        />
        {/* File input and value display */}
        <div className="flex items-center border-r border-neutral-800 px-2">
          <label className="flex items-center cursor-pointer">
            <span className="text-blue-400 hover:underline mr-2">Choose files</span>
            <input
              type="file"
              className="hidden"
              onChange={e => handleMultipartFileChange(param.id, e.target.files?.[0] || null)}
            />
          </label>
          <span className="ml-2 text-zinc-400 text-xs">{param.file ? param.file.name : 'No file chosen'}</span>
        </div>
        {showContentType && (
          <input
            className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
            value={param.contentType}
            placeholder="Content-Type"
            onChange={e => handleMultipartContentTypeChange(param.id, e.target.value)}
          />
        )}
        <div className="flex items-center gap-2 justify-end px-2">
          <button className="text-green-500 hover:text-green-400" tabIndex={-1}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
          </button>
          <button className="text-red-500 hover:text-red-400" onClick={() => handleDeleteMultipartBodyParam(param.id)} tabIndex={-1}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    );
  });

  // Add state for octet-stream file
  const [octetStreamFile, setOctetStreamFile] = useState<File | null>(null);

  // Headers state and handlers
  const [editHeadersActive, setEditHeadersActive] = useState(false);
  const handleHeaderChange = (id: string, field: 'key' | 'value' | 'description', value: string) => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      let updatedHeaders = tab.headers.map((h: any) => h.id === id ? { ...h, [field]: value } : h);
      // Only consider editable rows (not locked)
      const editableRows = updatedHeaders.filter((h: any) => !h.locked);
      const lastEditable = editableRows[editableRows.length - 1];
      if (
        field === 'key' &&
        lastEditable &&
        lastEditable.id === id &&
        value.trim() !== '' &&
        editableHeaderOptions.includes(value) &&
        editableRows.length + 1 < 10 // prevent runaway row creation
      ) {
        // Insert a new editable row before the locked row
        const lockedIdx = updatedHeaders.findIndex((h: any) => h.locked);
        const newRow = { id: uuidv4(), key: '', value: '', description: '', locked: false };
        updatedHeaders = [
          ...updatedHeaders.slice(0, lockedIdx),
          newRow,
          ...updatedHeaders.slice(lockedIdx)
        ];
      }
      return { ...tab, headers: updatedHeaders };
    }));
  };
  const handleDeleteHeader = (id: string) => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      const updatedHeaders = tab.headers.filter((h: any) => h.id !== id || h.locked);
      return { ...tab, headers: updatedHeaders };
    }));
  };
  const handleAddHeader = () => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      return { ...tab, headers: [...tab.headers, { id: uuidv4(), key: '', value: '', description: '' }] };
    }));
  };
  const handleHeaderDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTabs(tabs => tabs.map(tab => {
        if (tab.id !== activeTabId) return tab;
        const headers = tab.headers;
        const lockedIdx = headers.findIndex((h: any) => h.locked);
        const editable = headers.filter((h: any) => !h.locked);
        // Only allow reordering editable rows
        const oldIndex = editable.findIndex((i: any) => i.id === active.id);
        const newIndex = editable.findIndex((i: any) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return tab;
        const newEditable = arrayMove(editable, oldIndex, newIndex);
        // Rebuild headers: editable rows, then locked row
        const newHeaders = [...newEditable, headers[lockedIdx]];
        return { ...tab, headers: newHeaders };
      }));
    }
  };
  // List of common HTTP header names for dropdown
  const headerNameOptions = [
    'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Datetime',
    'Authorization', 'Cache-Control', 'Connection', 'Cookie', 'Content-Length', 'Content-MD5',
    'Content-Type', 'Date', 'Expect', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since',
    'If-None-Match', 'If-Range', 'If-Unmodified-Since', 'Max-Forwards', 'Pragma', 'Proxy-Authorization',
    'Range', 'Referer', 'TE', 'User-Agent', 'Upgrade', 'Via', 'Warning', 'WWW-Authenticate',
    'Proxy-Authenticate', 'Age', 'ETag', 'Location', 'Retry-After', 'Server', 'Set-Cookie', 'Vary',
    'X-Requested-With', 'DNT', 'X-Frame-Options', 'X-XSS-Protection', 'X-Content-Type-Options',
    'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'Front-End-Https', 'X-Http-Method-Override',
    'X-ATT-DeviceId', 'X-Wap-Profile', 'Proxy-Connection', 'X-UIDH', 'X-Csrf-Token', 'X-Request-ID',
    'X-Correlation-ID',
  ];
  // Only these options for all editable header rows
  const editableHeaderOptions = [
    'WWW-Authenticate',
    'Authorization',
    'Proxy-Authenticate',
    'Proxy-Authorization',
    'Age',
  ];
  const SortableHeaderRow = React.memo(function SortableHeaderRow({ header, handleHeaderChange, handleDeleteHeader, isOdd }: {
    header: { id: string; key: string; value: string; description: string; locked?: boolean };
    handleHeaderChange: (id: string, field: 'key' | 'value' | 'description', value: string) => void;
    handleDeleteHeader: (id: string) => void;
    isOdd: boolean;
  }) {
    const isLocked = !!header.locked;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: header.id, disabled: isLocked });
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          background: isOdd ? '#19191b' : undefined,
          minHeight: '38px',
          display: 'grid',
          gridTemplateColumns: '32px 1fr 1fr 1fr auto',
          borderBottom: '1px solid #27272a',
          paddingLeft: 0,
          paddingRight: 8,
          alignItems: 'center',
        }}
        className="px-2 group"
      >
        {/* Drag handle: hidden if locked */}
        <button
          {...(!isLocked ? attributes : {})}
          {...(!isLocked ? listeners : {})}
          className={`flex items-center justify-center cursor-grab focus:outline-none h-full ${isLocked ? 'opacity-0 pointer-events-none' : ''}`}
          style={{ background: 'none', border: 'none', padding: 0 }}
          tabIndex={-1}
          title="Drag to reorder"
          disabled={isLocked}
        >
          <span className="inline-block opacity-0 group-hover:opacity-70 transition-opacity duration-150">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="4" r="1" fill="#888" />
              <circle cx="7" cy="4" r="1" fill="#888" />
              <circle cx="11" cy="4" r="1" fill="#888" />
              <circle cx="3" cy="9" r="1" fill="#888" />
              <circle cx="7" cy="9" r="1" fill="#888" />
              <circle cx="11" cy="9" r="1" fill="#888" />
            </svg>
          </span>
        </button>
        {/* Key as dropdown for editable, plain text for locked */}
        {isLocked ? (
          <div className="bg-[#18181A] text-white px-2 py-1 w-full border-r border-neutral-800 select-none" style={{height: 36, display: 'flex', alignItems: 'center'}}>
            <span className="text-zinc-400">content type</span>
          </div>
        ) : (
          <select
            className="bg-[#18181A] text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
            value={header.key}
            onChange={e => handleHeaderChange(header.id, 'key', e.target.value)}
          >
            <option value="">Select header</option>
            {editableHeaderOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        {/* Value and Description as text inputs, disabled if locked */}
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={header.value}
          placeholder="Value"
          onChange={e => handleHeaderChange(header.id, 'value', e.target.value)}
          disabled={isLocked}
        />
        <input
          className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
          value={header.description}
          placeholder="Description"
          onChange={e => handleHeaderChange(header.id, 'description', e.target.value)}
          disabled={isLocked}
        />
        <div className="flex items-center gap-2 justify-end px-2">
          <button className="text-green-500 hover:text-green-400" tabIndex={-1} disabled={isLocked}>
            <span className="material-icons">check_circle</span>
          </button>
          <button className="text-red-500 hover:text-red-400" onClick={() => handleDeleteHeader(header.id)} tabIndex={-1} disabled={isLocked}>
            <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
    );
  });

  // Add at the top of the component:
  const authorizationTypes = [
    'Inherit',
    'None',
    'Basic Auth',
    'Digest Auth',
    'Bearer',
    'OAuth 2.0',
    'API Key',
    'AWS Signature',
    'HAWK',
    'JWT',
  ];
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [selectedAuthType, setSelectedAuthType] = useState('Inherit');
  const authDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!authDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node)) {
        setAuthDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [authDropdownOpen]);

  // Add at the top of the component:
  const digestAlgorithms = ['MD5', 'MD5-sess'];
  const [digestAlgorithm, setDigestAlgorithm] = useState('MD5');
  const [digestAlgDropdownOpen, setDigestAlgDropdownOpen] = useState(false);
  const digestAlgDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!digestAlgDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (digestAlgDropdownRef.current && !digestAlgDropdownRef.current.contains(e.target as Node)) {
        setDigestAlgDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [digestAlgDropdownOpen]);

  // Add at the top of the component:
  const oauthGrantTypes = ['Authorization Code', 'Client Credentials', 'Password', 'Implicit'];
  const [oauthGrantType, setOauthGrantType] = useState('Authorization Code');
  const [oauthGrantDropdownOpen, setOauthGrantDropdownOpen] = useState(false);
  const oauthGrantDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!oauthGrantDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (oauthGrantDropdownRef.current && !oauthGrantDropdownRef.current.contains(e.target as Node)) {
        setOauthGrantDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [oauthGrantDropdownOpen]);

  // Add at the top of the component:
  const oauthPassByOptions = ['Headers', 'Query Params'];
  const [oauthPassBy, setOauthPassBy] = useState('Headers');
  const [oauthPassByDropdownOpen, setOauthPassByDropdownOpen] = useState(false);
  const oauthPassByDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!oauthPassByDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (oauthPassByDropdownRef.current && !oauthPassByDropdownRef.current.contains(e.target as Node)) {
        setOauthPassByDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [oauthPassByDropdownOpen]);

  // Add at the top of the component:
  const hawkAlgorithms = ['HS256', 'SHA256', 'SHA1'];
  const [hawkAlgorithm, setHawkAlgorithm] = useState('HS256');
  const [hawkAlgDropdownOpen, setHawkAlgDropdownOpen] = useState(false);
  const hawkAlgDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hawkAlgDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (hawkAlgDropdownRef.current && !hawkAlgDropdownRef.current.contains(e.target as Node)) {
        setHawkAlgDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [hawkAlgDropdownOpen]);

  const jwtAlgorithms = ['HS256', 'RS256', 'HS384', 'HS512', 'RS384', 'RS512'];
  const [jwtAlgorithm, setJwtAlgorithm] = useState('HS256');
  const [jwtAlgDropdownOpen, setJwtAlgDropdownOpen] = useState(false);
  const jwtAlgDropdownRef = React.useRef<HTMLDivElement>(null);
  const [jwtSecret, setJwtSecret] = useState('');
  const [jwtSecretBase64, setJwtSecretBase64] = useState(false);
  const [jwtPayload, setJwtPayload] = useState('{}');
  const [jwtHeaders, setJwtHeaders] = useState('{}');

  React.useEffect(() => {
    if (!jwtAlgDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (jwtAlgDropdownRef.current && !jwtAlgDropdownRef.current.contains(e.target as Node)) {
        setJwtAlgDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [jwtAlgDropdownOpen]);

  const [preRequestScript, setPreRequestScript] = useState('');
  const preRequestDivRef = useRef<HTMLDivElement>(null);

  function insertPreRequestSnippet(snippet: string) {
    if (!preRequestDivRef.current) {
      setPreRequestScript(prev => prev ? prev + '\n\n' + snippet : snippet);
      return;
    }
    const div = preRequestDivRef.current;
    let sel = window.getSelection();
    let range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    // Insert at caret or append
    let text = preRequestScript;
    let insertAt = text.length;
    if (range && div.contains(range.startContainer)) {
      // Find caret position in text
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(div);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      insertAt = preCaretRange.toString().length;
    }
    // Ensure blank line before snippet if not at top
    let before = text.slice(0, insertAt);
    let after = text.slice(insertAt);
    if (before && !before.endsWith('\n\n')) before += '\n\n';
    const newValue = before + snippet + after;
    setPreRequestScript(newValue);
    setTimeout(() => {
      div.focus();
      // Move caret to after inserted snippet
      const sel = window.getSelection();
      if (sel && div.childNodes.length > 0) {
        sel.collapse(div.childNodes[div.childNodes.length - 1], 1);
      }
    }, 0);
  }

  function highlightPreRequestScript(script: string) {
    // Comments: gray, pw.env.set: blue, strings: magenta
    return script.split('\n').map((line, idx) => {
      if (line.trim().startsWith('//')) {
        return <div key={idx}><span style={{color:'#a3a3a3'}}>{line}</span></div>;
      }
      // Highlight pw.env.set in blue, strings in magenta
      // Regex: pw.env.set("variable", "value");
      const regex = /(pw\.env\.set)(\(([^)]*)\);?)/;
      const match = line.match(regex);
      if (match) {
        // Extract arguments inside parentheses
        const args = match[2].replace(/[()]/g, '');
        // Split by comma, keep quotes
        const argParts = args.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.trim());
        return (
          <div key={idx}>
            <span style={{color:'#3b82f6'}}>{match[1]}</span>
            <span style={{color:'#e5e7eb'}}>(</span>
            {argParts.map((arg, i) => (
              <span key={i} style={{color:arg.startsWith('"') ? '#d946ef' : '#e5e7eb'}}>
                {arg}{i < argParts.length-1 ? ', ' : ''}
              </span>
            ))}
            <span style={{color:'#e5e7eb'}}>)</span>
            <span style={{color:'#e5e7eb'}}>{line.endsWith(';') ? ';' : ''}</span>
          </div>
        );
      }
      return <div key={idx} style={{color:'#e5e7eb'}}>{line || '\u00A0'}</div>;
    });
  }

  const [postRequestScript, setPostRequestScript] = useState('');
  const postRequestDivRef = useRef<HTMLDivElement>(null);

  function insertPostRequestSnippet(snippet: string) {
    if (!postRequestDivRef.current) {
      setPostRequestScript(prev => prev ? prev + '\n\n' + snippet : snippet);
      return;
    }
    const div = postRequestDivRef.current;
    let sel = window.getSelection();
    let range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    let text = postRequestScript;
    let insertAt = text.length;
    if (range && div.contains(range.startContainer)) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(div);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      insertAt = preCaretRange.toString().length;
    }
    let before = text.slice(0, insertAt);
    let after = text.slice(insertAt);
    if (before && !before.endsWith('\n\n')) before += '\n\n';
    const newValue = before + snippet + after;
    setPostRequestScript(newValue);
    setTimeout(() => {
      div.focus();
      const sel = window.getSelection();
      if (sel && div.childNodes.length > 0) {
        sel.collapse(div.childNodes[div.childNodes.length - 1], 1);
      }
    }, 0);
  }

  function highlightPostRequestScript(script: string) {
    // Comments: gray, pw.env.set: blue, strings: magenta
    return script.split('\n').map((line, idx) => {
      if (line.trim().startsWith('//')) {
        return <div key={idx}><span style={{color:'#a3a3a3'}}>{line}</span></div>;
      }
      // Highlight pw.env.set in blue, strings in magenta
      // Regex: pw.env.set("variable", "value");
      const regex = /(pw\.env\.set)(\(([^)]*)\);?)/;
      const match = line.match(regex);
      if (match) {
        // Extract arguments inside parentheses
        const args = match[2].replace(/[()]/g, '');
        // Split by comma, keep quotes
        const argParts = args.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.trim());
        return (
          <div key={idx}>
            <span style={{color:'#3b82f6'}}>{match[1]}</span>
            <span style={{color:'#e5e7eb'}}>(</span>
            {argParts.map((arg, i) => (
              <span key={i} style={{color:arg.startsWith('"') ? '#d946ef' : '#e5e7eb'}}>
                {arg}{i < argParts.length-1 ? ', ' : ''}
              </span>
            ))}
            <span style={{color:'#e5e7eb'}}>)</span>
            <span style={{color:'#e5e7eb'}}>{line.endsWith(';') ? ';' : ''}</span>
          </div>
        );
      }
      return <div key={idx} style={{color:'#e5e7eb'}}>{line || '\u00A0'}</div>;
    });
  }

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
        {/* Left Content (hide when editActive) */}
        <div className="flex flex-col flex-1 p-4">
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v2a2 2 0 0 0 2 2h2"/><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M16 12h2a2 2 0 0 1 2 2v2"/><path d="M8 16v2a2 2 0 0 0 2 2h2"/></svg>
                    <span className="flex-1 text-left">Share Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 text-[12px] border-b border-gray-800 mb-2">
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
            <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
              {/* Query Parameters Bar - always visible */}
              <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-800">
                <span className="text-gray-400 text-sm">Query Parameters</span>
                <div className="flex items-center gap-3">
                  <button
                    className="text-gray-400 hover:text-white"
                    title="Help"
                    onClick={() => window.open('https://docs.hoppscotch.io/documentation/features/rest-api-testing', '_blank')}
                  >
                    <span className="inline-block align-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    </span>
                  </button>
                  <button
                    className="text-gray-400 hover:text-white"
                    title="Delete all"
                    onClick={() => setQueryParams([{ id: uuidv4(), key: '', value: '', description: '' }])}
                  >
                    <span className="inline-block align-middle">
                      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"></path></svg>
                    </span>
                  </button>
                  <div className="relative flex items-center">
                    {editActive && (
                      <AnimatePresence>
                        <motion.span
                          className="inline-block align-middle mr-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M3 6h18M3 12h15a3 3 0 1 1 0 6h-4"></path><path d="m16 16l-2 2l2 2M3 18h7"></path></g></svg>
                        </motion.span>
                      </AnimatePresence>
                    )}
                    <button
                      className={`text-gray-400 hover:text-white ${editActive ? 'text-blue-500' : ''}`}
                      title="Edit"
                      onClick={() => setEditActive(v => !v)}
                    >
                      <span className="inline-block align-middle">
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
                      </span>
                    </button>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white"
                    title="Add"
                    onClick={() => setQueryParams(prev => [...prev, { id: uuidv4(), key: '', value: '', description: '' }])}
                  >
                    <span className="inline-block align-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </span>
                  </button>
                </div>
              </div>
              {/* Query Parameters table or instructional area always directly below the bar */}
              <div>
                {editActive ? (
                  <div className="bg-[#18181A] rounded-b-2xl p-0 border-t border-neutral-800" style={{minHeight: '120px', maxWidth: '100%'}}>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-end pt-4 pl-1 pr-2 select-none text-zinc-700 text-sm font-mono">
                        <span>1</span>
                      </div>
                      <pre className="pl-10 pt-4 pb-4 pr-4 text-gray-400 text-[15px] font-mono whitespace-pre-wrap select-none bg-transparent m-0" style={{minHeight: '120px'}}>
Entries are separated by newline
Keys and values are separated by :
Prepend # to any row you want to add but keep disabled
                      </pre>
                    </div>
                  </div>
                ) : (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={queryParams.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      <div className="w-full">
                        <div className="grid grid-cols-5 border-b border-neutral-800 px-2" style={{minHeight: '38px', gridTemplateColumns: '32px 1fr 1fr 1fr auto'}}>
                          <div></div>
                          <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Key</div>
                          <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Value</div>
                          <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Description</div>
                          <div></div>
                        </div>
                        {queryParams.map((param, idx) => (
                          <SortableParamRow
                            key={param.id}
                            param={param}
                            handleParamChange={handleParamChange}
                            handleDeleteParam={handleDeleteParam}
                            setFocusedRow={setFocusedRow}
                            isOdd={idx % 2 === 1}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          )}
          {activeTabObj.activeTab === 'body' && (
            <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
              {/* Body Bar: Content Type */}
              <div className="flex items-center gap-3 px-4 h-10 border-b border-neutral-800 relative">
                <span className="text-gray-400 text-sm">Content Type</span>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 bg-zinc-800 text-gray-200 text-sm px-3 py-1 rounded border border-zinc-700 focus:outline-none min-w-[90px]"
                    onClick={() => setDropdownOpen(v => !v)}
                  >
                    {contentTypeOptions.find(opt => opt.value === contentType)?.label || 'None'}
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute left-0 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded shadow-lg z-50 py-2 max-h-72 overflow-y-auto"
                      style={{ ...hideScrollbarStyle }}
                    >
                      {contentTypeOptions.map((opt, idx) => (
                        opt.isSection ? (
                          <div key={opt.label} className="px-4 py-1 text-xs text-zinc-500 uppercase tracking-wider select-none">
                            {opt.label}
                          </div>
                        ) : (
                          <button
                            key={opt.value}
                            className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 ${contentType === opt.value ? 'text-violet-400' : 'text-gray-200'}`}
                            onClick={() => { setContentType(opt.value); setDropdownOpen(false); }}
                          >
                            <span className="flex-1">{opt.label}</span>
                            {contentType === opt.value && (
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                            )}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="bg-zinc-800 border border-zinc-700 text-gray-200 text-sm px-3 py-1 rounded ml-2 flex items-center gap-1 focus:outline-none"
                  onClick={() => setActiveTab('headers')}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 12h20"/><path d="M12 2v20"/></svg>
                  Override
                </button>
              </div>
              {/* Raw Request Body Bar (only for application/json) */}
              {(
                contentType === 'application/json' ||
                contentType === 'application/ld+json' ||
                contentType === 'application/hal+json' ||
                contentType === 'application/vnd.api+json' ||
                contentType === 'application/xml' ||
                contentType === 'text/xml' ||
                contentType === 'text/html' ||
                contentType === 'text/plain'
              ) && (
                <>
                  <div className="flex items-center justify-between px-4 h-9 border-b border-neutral-800 bg-[#18181A]">
                    <span className="text-gray-400 text-sm">Raw Request Body</span>
                    <div className="flex items-center gap-3">
                      {/* Help icon */}
                      <button className="text-gray-400 hover:text-white" title="Help">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                      </button>
                      {/* Delete icon */}
                      <button className="text-gray-400 hover:text-white" title="Delete">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                      {/* Format icon */}
                      <button className="text-gray-400 hover:text-white" title="Format">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      </button>
                      {/* Magic wand icon (only omit for text/xml) */}
                      {(contentType !== 'text/xml') && (
                        <button className="text-gray-400 hover:text-white" title="Magic">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 4V2m0 20v-2m7-7h-2M4 15H2m2.93-7.07l-1.42-1.42m16.97 16.97l-1.42-1.42m16.97-16.97l-1.42 1.42"/><path d="M8 12l4 4 6-6"/></svg>
                        </button>
                      )}
                      {/* Graph icon */}
                      <button className="text-gray-400 hover:text-white" title="Graph">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>
                      </button>
                      {/* Copy icon */}
                      <button className="text-gray-400 hover:text-white" title="Copy">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Code editor area */}
                  <div className="flex-1 flex bg-[#18181A] min-h-0" style={{ fontFamily: 'monospace' }}>
                    {/* Line numbers */}
                    <div className="flex flex-col items-end py-3 px-2 select-none text-zinc-700 text-sm border-r border-neutral-800 min-h-0" style={{ minWidth: 32 }}>
                      {Array.from({ length: (rawBody.match(/\n/g)?.length ?? 0) + 1 }, (_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>
                    {/* Textarea */}
                    <textarea
                      value={rawBody}
                      onChange={e => setRawBody(e.target.value)}
                      className="flex-1 bg-transparent text-zinc-200 px-3 py-3 text-sm outline-none resize-none h-full min-h-0"
                      style={{ fontFamily: 'monospace', border: 'none' }}
                      spellCheck={false}
                      placeholder={contentType === 'application/json' ? '{\n  "key": "value"\n}' : ''}
                    />
                  </div>
                </>
              )}
              {contentType === 'application/x-www-form-urlencoded' && (
                <>
                  {/* Request Body Bar */}
                  <div className="flex items-center justify-between px-4 h-9 border-b border-neutral-800 bg-[#18181A]">
                    <span className="text-gray-400 text-sm">Request Body</span>
                    <div className="flex items-center gap-3">
                      {/* Help icon */}
                      <button className="text-gray-400 hover:text-white" title="Help">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                      </button>
                      {/* Delete icon */}
                      <button className="text-gray-400 hover:text-white" title="Delete All" onClick={() => setBodyParams([{ id: uuidv4(), key: '', value: '' }])}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                      {/* Edit icon */}
                      <button className="text-gray-400 hover:text-white" title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
                      </button>
                      {/* Add icon */}
                      <button className="text-gray-400 hover:text-white" title="Add" onClick={handleAddBodyParam}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Table for key-value pairs */}
                  <div className="w-full">
                    <div className="grid grid-cols-4 border-b border-neutral-800 px-2" style={{ minHeight: '38px', gridTemplateColumns: '32px 1fr 1fr auto' }}>
                      <div></div>
                      <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Parameter</div>
                      <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Value</div>
                      <div></div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleBodyDragEnd}>
                      <SortableContext items={bodyParams.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        <div className="w-full">
                          {bodyParams.map((param, idx) => (
                            <SortableBodyParamRow
                              key={param.id}
                              param={param}
                              handleBodyParamChange={handleBodyParamChange}
                              handleDeleteBodyParam={handleDeleteBodyParam}
                              isOdd={idx % 2 === 1}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </>
              )}
              {contentType === 'multipart/form-data' && (
                <>
                  {/* Request Body Bar */}
                  <div className="flex items-center justify-between px-4 h-9 border-b border-neutral-800 bg-[#18181A]">
                    <span className="text-gray-400 text-sm">Request Body</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-xs text-zinc-400 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showMultipartContentType}
                          onChange={e => setShowMultipartContentType(e.target.checked)}
                          className="accent-blue-500"
                        />
                        Show Content Type
                      </label>
                      {/* Help icon */}
                      <button className="text-gray-400 hover:text-white" title="Help">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                      </button>
                      {/* Delete icon */}
                      <button className="text-gray-400 hover:text-white" title="Delete All" onClick={() => setMultipartBodyParams([{ id: uuidv4(), key: '', value: '', contentType: '', file: null }])}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                      {/* Edit icon */}
                      <button className="text-gray-400 hover:text-white" title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
                      </button>
                      {/* Add icon */}
                      <button className="text-gray-400 hover:text-white" title="Add" onClick={handleAddMultipartBodyParam}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Table for multipart/form-data */}
                  <div className="w-full">
                    <div className={`grid border-b border-neutral-800 px-2`} style={{ minHeight: '38px', gridTemplateColumns: showMultipartContentType ? '32px 1fr 1fr 1fr auto' : '32px 1fr 1fr auto' }}>
                      <div></div>
                      <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Parameter</div>
                      <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Value</div>
                      {showMultipartContentType && <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Content Type</div>}
                      <div></div>
                    </div>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleMultipartBodyDragEnd}>
                      <SortableContext items={multipartBodyParams.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        <div className="w-full">
                          {multipartBodyParams.map((param, idx) => (
                            <SortableMultipartBodyParamRow
                              key={param.id}
                              param={param}
                              handleMultipartBodyParamChange={handleMultipartBodyParamChange}
                              handleDeleteMultipartBodyParam={handleDeleteMultipartBodyParam}
                              handleMultipartFileChange={handleMultipartFileChange}
                              handleMultipartContentTypeChange={handleMultipartContentTypeChange}
                              isOdd={idx % 2 === 1}
                              showContentType={showMultipartContentType}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </>
              )}
              {contentType === 'application/octet-stream' && (
                <div className="px-4 pt-4">
                  <input
                    type="file"
                    onChange={e => setOctetStreamFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
              {/* Body Content Placeholder */}
            
            </div>
          )}
          {activeTabObj.activeTab === 'headers' && (
            <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
              {/* Header List Bar - always visible */}
              <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-800">
                <span className="text-gray-400 text-sm">Header List</span>
                <div className="flex items-center gap-3">
                  <button
                    className="text-gray-400 hover:text-white"
                    title="Help"
                    onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers', '_blank')}
                  >
                    <span className="inline-block align-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    </span>
                  </button>
                  <button
                    className="text-gray-400 hover:text-white"
                    title="Delete all"
                    onClick={() => setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, headers: [{ id: uuidv4(), key: '', value: '', description: '' }] } : tab))}
                  >
                    <span className="inline-block align-middle">
                      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"></path></svg>
                    </span>
                  </button>
                  <div className="relative flex items-center">
                    {editHeadersActive && (
                      <AnimatePresence>
                        <motion.span
                          className="inline-block align-middle mr-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M3 6h18M3 12h15a3 3 0 1 1 0 6h-4"></path><path d="m16 16l-2 2l2 2M3 18h7"></path></g></svg>
                        </motion.span>
                      </AnimatePresence>
                    )}
                    <button
                      className={`text-gray-400 hover:text-white ${editHeadersActive ? 'text-blue-500' : ''}`}
                      title="Edit"
                      onClick={() => setEditHeadersActive(v => !v)}
                    >
                      <span className="inline-block align-middle">
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
                      </span>
                    </button>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white"
                    title="Add"
                    onClick={handleAddHeader}
                  >
                    <span className="inline-block align-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </span>
                  </button>
                </div>
              </div>
              {/* Header List table or instructional area always directly below the bar */}
              <div>
                {editHeadersActive ? (
                  <div className="bg-[#18181A] rounded-b-2xl p-0 border-t border-neutral-800" style={{minHeight: '120px', maxWidth: '100%'}}>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-end pt-4 pl-1 pr-2 select-none text-zinc-700 text-sm font-mono">
                        <span>1</span>
                      </div>
                      <pre className="pl-10 pt-4 pb-4 pr-4 text-gray-400 text-[15px] font-mono whitespace-pre-wrap select-none bg-transparent m-0" style={{minHeight: '120px'}}>
Headers are key-value pairs sent with requests
You can drag to reorder or disable
Prepend # to any row you want to add but keep disabled
                      </pre>
                    </div>
                  </div>
                ) : (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleHeaderDragEnd}>
                    <SortableContext items={activeTabObj.headers.map((h: any) => h.id)} strategy={verticalListSortingStrategy}>
                      <div className="w-full">
                        <div className="grid grid-cols-5 border-b border-neutral-800 px-2" style={{minHeight: '38px', gridTemplateColumns: '32px 1fr 1fr 1fr auto'}}>
                          <div></div>
                          <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Key</div>
                          <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Value</div>
                          <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Description</div>
                          <div></div>
                        </div>
                        {activeTabObj.headers.map((header: any, idx: number) => (
                          <SortableHeaderRow
                            key={header.id}
                            header={header}
                            handleHeaderChange={handleHeaderChange}
                            handleDeleteHeader={handleDeleteHeader}
                            isOdd={idx % 2 === 1}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          )}
          {activeTabObj.activeTab === 'authorization' && (
            <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
              {/* Authorization Bar */}
              <div className="flex items-center px-4 h-10 border-b border-neutral-800 relative bg-[#18181A]" style={{minHeight: 40}}>
                <span className="text-zinc-400 text-sm mr-4" style={{minWidth: 140}}>Authorization Type</span>
                <div className="relative" ref={authDropdownRef}>
                  <button
                    className="flex items-center gap-1 text-zinc-200 font-semibold text-sm px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                    style={{minWidth: 70}}
                    onClick={() => setAuthDropdownOpen(v => !v)}
                  >
                    {selectedAuthType}
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {authDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2 max-h-80 overflow-y-auto" style={{minWidth: 180}}>
                      {authorizationTypes.map(type => (
                        <label
                          key={type}
                          className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer select-none ${selectedAuthType === type ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                          style={{userSelect: 'none'}}
                        >
                          <input
                            type="radio"
                            name="authorizationType"
                            value={type}
                            checked={selectedAuthType === type}
                            onChange={() => { setSelectedAuthType(type); setAuthDropdownOpen(false); }}
                            className="accent-violet-600 mr-2"
                            style={{pointerEvents: 'none'}}
                            readOnly
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1" />
                <label className="flex items-center gap-1 text-zinc-300 text-sm mr-4 cursor-pointer select-none">
                  <input type="checkbox" className="accent-violet-600" style={{marginRight: 4}} />
                  Enabled
                </label>
                <button className="text-zinc-400 hover:text-violet-400 mx-1" tabIndex={-1} title="Help">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="1"/></svg>
                </button>
                <button className="text-zinc-400 hover:text-red-500 mx-1" tabIndex={-1} title="Delete">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4c0-1 1-2 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
              {/* No content below for now */}
              {selectedAuthType === 'Inherit' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex items-start p-6">
                    <span className="text-zinc-400 text-base">Please save this request in any collection to inherit the authorization</span>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#inheriting-auth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'None' && (
                <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-[#18181A]">
                  <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-6 opacity-40">
                    <rect x="12" y="12" width="40" height="40" rx="8" stroke="#888" strokeWidth="2" fill="none" />
                    <rect x="22" y="28" width="20" height="4" rx="2" fill="#888" opacity="0.3" />
                    <rect x="22" y="36" width="20" height="4" rx="2" fill="#888" opacity="0.3" />
                    <circle cx="32" cy="22" r="4" fill="#888" opacity="0.3" />
                  </svg>
                  <div className="text-zinc-400 text-lg mb-6">This request does not use any authorization</div>
                  <a
                    href="https://learning.postman.com/docs/sending-requests/authorization/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 rounded border border-zinc-700 text-zinc-200 bg-transparent hover:bg-zinc-800 flex items-center gap-2 text-base font-medium transition"
                  >
                    Documentation
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              )}
              {selectedAuthType === 'Basic Auth' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="username"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#basic-auth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'Digest Auth' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="username"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="current-password"
                    />
                    <div className="px-4 pt-6 pb-2">
                      <div className="font-semibold text-zinc-200 text-[15px] mb-1">Advanced Configuration</div>
                      <div className="text-zinc-400 text-sm mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                      <input
                        type="text"
                        placeholder="Realm (e.g. testrealm@example.com)"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Nonce"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <div className="flex items-center border-b border-neutral-800" style={{height: 48}}>
                        <span className="text-zinc-400 text-base px-0 mr-4" style={{minWidth: 90}}>Algorithm</span>
                        <div className="relative" ref={digestAlgDropdownRef}>
                          <button
                            className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                            style={{minWidth: 70}}
                            onClick={() => setDigestAlgDropdownOpen(v => !v)}
                            type="button"
                          >
                            {digestAlgorithm}
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                          </button>
                          {digestAlgDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-40 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2" style={{zIndex: 9999}}>
                              {digestAlgorithms.map(alg => (
                                <label
                                  key={alg}
                                  className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${digestAlgorithm === alg ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                  style={{userSelect: 'none'}}
                                >
                                  <input
                                    type="radio"
                                    name="digestAlgorithm"
                                    value={alg}
                                    checked={digestAlgorithm === alg}
                                    onChange={() => { setDigestAlgorithm(alg); setDigestAlgDropdownOpen(false); }}
                                    className="accent-violet-600 mr-2"
                                    style={{pointerEvents: 'none'}}
                                    readOnly
                                  />
                                  {alg}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="qop (e.g. auth-int)"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Nonce Count (e.g. 00000001)"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Client Nonce (e.g. 0a4f113b)"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Opaque"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                    </div>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#digest-auth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'Bearer' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="Token"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#bearer-token"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'OAuth 2.0' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="Token"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <div className="flex items-center border-b border-neutral-800 px-4" style={{height: 48}}>
                      <span className="text-zinc-400 text-base mr-4" style={{minWidth: 90}}>Grant Type</span>
                      <div className="relative" ref={oauthGrantDropdownRef}>
                        <button
                          className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                          style={{minWidth: 120}}
                          type="button"
                          onClick={() => setOauthGrantDropdownOpen(v => !v)}
                        >
                          {oauthGrantType}
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {oauthGrantDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-56 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2">
                            {oauthGrantTypes.map(type => (
                              <label
                                key={type}
                                className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${oauthGrantType === type ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                style={{userSelect: 'none'}}
                              >
                                <input
                                  type="radio"
                                  name="oauthGrantType"
                                  value={type}
                                  checked={oauthGrantType === type}
                                  onChange={() => { setOauthGrantType(type); setOauthGrantDropdownOpen(false); }}
                                  className="accent-violet-600 mr-2"
                                  style={{pointerEvents: 'none'}}
                                  readOnly
                                />
                                {type}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center border-b border-neutral-800 px-4" style={{height: 48}}>
                      <label className="flex items-center gap-2 text-zinc-400 text-base cursor-pointer select-none">
                        <input type="checkbox" className="accent-violet-600" style={{marginRight: 4}} />
                        Use PKCE
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Authorization Endpoint"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                    />
                    <input
                      type="text"
                      placeholder="Token Endpoint"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                    />
                    <input
                      type="text"
                      placeholder="Client ID"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                    />
                    <input
                      type="text"
                      placeholder="Client Secret"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                    />
                    <input
                      type="text"
                      placeholder="Scopes"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                    />
                    <div className="flex items-center border-b border-neutral-800 px-4" style={{height: 48}}>
                      <span className="text-zinc-400 text-base mr-4" style={{minWidth: 90}}>Pass by</span>
                      <div className="relative" ref={oauthPassByDropdownRef}>
                        <button
                          className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                          style={{minWidth: 90}}
                          type="button"
                          onClick={() => setOauthPassByDropdownOpen(v => !v)}
                        >
                          {oauthPassBy}
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {oauthPassByDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-40 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2">
                            {oauthPassByOptions.map(opt => (
                              <label
                                key={opt}
                                className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${oauthPassBy === opt ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                style={{userSelect: 'none'}}
                              >
                                <input
                                  type="radio"
                                  name="oauthPassBy"
                                  value={opt}
                                  checked={oauthPassBy === opt}
                                  onChange={() => { setOauthPassBy(opt); setOauthPassByDropdownOpen(false); }}
                                  className="accent-violet-600 mr-2"
                                  style={{pointerEvents: 'none'}}
                                  readOnly
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 px-4 py-6">
                      <button className="px-6 py-2 rounded border border-zinc-700 text-zinc-200 bg-transparent hover:bg-zinc-800 text-base font-medium transition">Generate Token</button>
                      <button className="px-6 py-2 rounded border border-zinc-700 text-zinc-200 bg-transparent hover:bg-zinc-800 text-base font-medium transition">Refresh Token</button>
                    </div>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#oauth-2-0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'API Key' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="Key"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <div className="flex items-center border-b border-neutral-800 px-4" style={{height: 48}}>
                      <span className="text-zinc-400 text-base mr-4" style={{minWidth: 90}}>Pass by</span>
                      <div className="relative" ref={oauthPassByDropdownRef}>
                        <button
                          className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                          style={{minWidth: 90}}
                          type="button"
                          onClick={() => setOauthPassByDropdownOpen(v => !v)}
                        >
                          {oauthPassBy}
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {oauthPassByDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-40 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2">
                            {oauthPassByOptions.map(opt => (
                              <label
                                key={opt}
                                className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${oauthPassBy === opt ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                style={{userSelect: 'none'}}
                              >
                                <input
                                  type="radio"
                                  name="oauthPassBy"
                                  value={opt}
                                  checked={oauthPassBy === opt}
                                  onChange={() => { setOauthPassBy(opt); setOauthPassByDropdownOpen(false); }}
                                  className="accent-violet-600 mr-2"
                                  style={{pointerEvents: 'none'}}
                                  readOnly
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'AWS Signature' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="Access Key"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      placeholder="Secret Key"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <div className="px-4 pt-6 pb-2">
                      <div className="font-semibold text-zinc-200 text-[15px] mb-1">Advanced Configuration</div>
                      <div className="text-zinc-400 text-sm mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                      <input
                        type="text"
                        placeholder="AWS Region (default: us-east-1)"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Service Name"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Service Token"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                    </div>
                    <div className="flex items-center border-b border-neutral-800 px-4" style={{height: 48}}>
                      <span className="text-zinc-400 text-base mr-4" style={{minWidth: 90}}>Pass by</span>
                      <div className="relative" ref={oauthPassByDropdownRef}>
                        <button
                          className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                          style={{minWidth: 90}}
                          type="button"
                          onClick={() => setOauthPassByDropdownOpen(v => !v)}
                        >
                          {oauthPassBy}
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {oauthPassByDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-40 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2">
                            {oauthPassByOptions.map(opt => (
                              <label
                                key={opt}
                                className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${oauthPassBy === opt ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                style={{userSelect: 'none'}}
                              >
                                <input
                                  type="radio"
                                  name="oauthPassBy"
                                  value={opt}
                                  checked={oauthPassBy === opt}
                                  onChange={() => { setOauthPassBy(opt); setOauthPassByDropdownOpen(false); }}
                                  className="accent-violet-600 mr-2"
                                  style={{pointerEvents: 'none'}}
                                  readOnly
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#aws-signature"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'HAWK' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <input
                      type="text"
                      placeholder="HAWK Auth ID"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      placeholder="HAWK Auth Key"
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <div className="flex items-center border-b border-neutral-800 px-4 relative" style={{height: 48}}>
                      <span className="text-zinc-400 text-base mr-4" style={{minWidth: 90}}>Algorithm</span>
                      <div className="relative" ref={hawkAlgDropdownRef}>
                        <button
                          className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                          style={{minWidth: 90}}
                          type="button"
                          onClick={() => setHawkAlgDropdownOpen(v => !v)}
                        >
                          {hawkAlgorithm}
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {hawkAlgDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-40 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2">
                            {hawkAlgorithms.map(alg => (
                              <label
                                key={alg}
                                className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${hawkAlgorithm === alg ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                style={{userSelect: 'none'}}
                              >
                                <input
                                  type="radio"
                                  name="hawkAlgorithm"
                                  value={alg}
                                  checked={hawkAlgorithm === alg}
                                  onChange={() => { setHawkAlgorithm(alg); setHawkAlgDropdownOpen(false); }}
                                  className="accent-violet-600 mr-2"
                                  style={{pointerEvents: 'none'}}
                                  readOnly
                                />
                                {alg}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-4 pt-6 pb-2">
                      <div className="font-semibold text-zinc-200 text-[15px] mb-1">Advanced Configuration</div>
                      <div className="text-zinc-400 text-sm mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                      <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Nonce"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="ext"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="app"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="dlg"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                      <input
                        type="text"
                        placeholder="Timestamp"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 py-3 text-base outline-none mb-0"
                        style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      />
                    </div>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#hawk-authentication"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
              {selectedAuthType === 'JWT' && (
                <div className="flex flex-row w-full flex-1 bg-[#18181A] border-t border-neutral-900 min-h-0" style={{height: '100%'}}>
                  <div className="flex-1 flex flex-col justify-start p-0">
                    <div className="flex items-center border-b border-neutral-800 px-4 relative" style={{height: 48}}>
                      <span className="text-zinc-400 text-base mr-4" style={{minWidth: 90}}>Algorithm</span>
                      <div className="relative" ref={jwtAlgDropdownRef}>
                        <button
                          className="flex items-center gap-1 text-zinc-200 font-semibold text-base px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
                          style={{minWidth: 90}}
                          type="button"
                          onClick={() => setJwtAlgDropdownOpen(v => !v)}
                        >
                          {jwtAlgorithm}
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {jwtAlgDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-40 bg-[#18181A] border border-neutral-800 rounded shadow-lg z-50 py-2">
                            {jwtAlgorithms.map(alg => (
                              <label
                                key={alg}
                                className={`flex items-center gap-3 px-4 py-2 text-base cursor-pointer select-none ${jwtAlgorithm === alg ? 'text-violet-400 font-semibold' : 'text-zinc-200'}`}
                                style={{userSelect: 'none'}}
                              >
                                <input
                                  type="radio"
                                  name="jwtAlgorithm"
                                  value={alg}
                                  checked={jwtAlgorithm === alg}
                                  onChange={() => { setJwtAlgorithm(alg); setJwtAlgDropdownOpen(false); }}
                                  className="accent-violet-600 mr-2"
                                  style={{pointerEvents: 'none'}}
                                  readOnly
                                />
                                {alg}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Secret"
                      value={jwtSecret}
                      onChange={e => setJwtSecret(e.target.value)}
                      className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 border-b border-neutral-800 px-4 py-3 text-base outline-none"
                      style={{borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}
                      autoComplete="off"
                    />
                    <label className="flex items-center gap-2 font-semibold text-zinc-200 px-4 py-3 border-b border-neutral-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={jwtSecretBase64}
                        onChange={e => setJwtSecretBase64(e.target.checked)}
                        className="accent-violet-600"
                      />
                      Secret Base64 Encoded
                    </label>
                    <div className="px-0 pt-4 flex flex-col flex-1">
                      <div className="text-zinc-400 text-base mb-2 px-4">Payload</div>
                      {/* Toolbar */}
                      <div className="flex items-center justify-between px-4 h-9 border-b border-neutral-800 bg-[#18181A]">
                        <span></span>
                        <div className="flex items-center gap-3">
                          {/* Help icon */}
                          <button className="text-gray-400 hover:text-white" title="Help">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                          </button>
                          {/* Delete icon */}
                          <button className="text-gray-400 hover:text-white" title="Delete">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                          {/* Format icon */}
                          <button className="text-gray-400 hover:text-white" title="Format">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                          </button>
                          {/* Magic wand icon */}
                          <button className="text-gray-400 hover:text-white" title="Magic">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 4V2m0 20v-2m7-7h-2M4 15H2m2.93-7.07l-1.42-1.42m16.97 16.97l-1.42-1.42m16.97-16.97l-1.42 1.42"/><path d="M8 12l4 4 6-6"/></svg>
                          </button>
                          {/* Graph icon */}
                          <button className="text-gray-400 hover:text-white" title="Graph">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>
                          </button>
                          {/* Copy icon */}
                          <button className="text-gray-400 hover:text-white" title="Copy">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>
                          </button>
                        </div>
                      </div>
                      {/* Code editor area */}
                      <div className="flex-1 flex bg-[#18181A] min-h-0" style={{ fontFamily: 'monospace' }}>
                        {/* Line numbers */}
                        <div className="flex flex-col items-end py-3 px-2 select-none text-zinc-700 text-sm border-r border-neutral-800 min-h-0" style={{ minWidth: 32 }}>
                          {Array.from({ length: (jwtPayload.match(/\n/g)?.length ?? 0) + 1 }, (_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                        {/* Textarea */}
                        <textarea
                          value={jwtPayload}
                          onChange={e => setJwtPayload(e.target.value)}
                          className="flex-1 bg-transparent text-zinc-200 px-3 py-3 text-sm outline-none resize-none h-full min-h-0"
                          style={{ fontFamily: 'monospace', border: 'none' }}
                          spellCheck={false}
                          placeholder="{}"
                        />
                      </div>
                    </div>
                    {/* Bearer section below Payload */}
                    <div className="w-full border-b border-neutral-800 bg-[#18181A] px-4 py-2 font-bold text-zinc-200 text-base">Bearer</div>
                    <div className="px-4 pt-4 flex flex-col flex-1">
                      <div className="text-zinc-400 text-base mb-2">JWT Headers</div>
                      <div className="flex-1 flex bg-[#18181A] min-h-0" style={{ fontFamily: 'monospace' }}>
                        {/* Line numbers */}
                        <div className="flex flex-col items-end py-3 px-2 select-none text-zinc-700 text-sm border-r border-neutral-800 min-h-0" style={{ minWidth: 32 }}>
                          {Array.from({ length: (jwtHeaders.match(/\n/g)?.length ?? 0) + 1 }, (_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                        {/* Textarea */}
                        <textarea
                          value={jwtHeaders}
                          onChange={e => setJwtHeaders(e.target.value)}
                          className="flex-1 bg-transparent text-zinc-200 px-3 py-3 text-sm outline-none resize-none h-full min-h-0"
                          style={{ fontFamily: 'monospace', border: 'none' }}
                          spellCheck={false}
                          placeholder="{}"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6">
                    <span className="text-zinc-400 text-base mb-2">The authorization header will be automatically generated when you send the request.</span>
                    <a
                      href="https://learning.postman.com/docs/sending-requests/authorization/#jwt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 text-base"
                    >
                      Learn how
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTabObj.activeTab === 'pre-request' && (
            <div className="flex flex-col flex-1 bg-[#18181A] rounded p-0 mt-2">
              {/* Pre-request Script Bar */}
              <div className="flex items-center justify-between px-4 h-10 bg-[#18181A] w-full">
                <span className="text-gray-400 text-base">JavaScript Code</span>
                <div className="flex items-center gap-3">
                  {/* Help icon */}
                  <button className="text-gray-400 hover:text-white" title="Help">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  </button>
                  {/* Delete icon */}
                  <button className="text-gray-400 hover:text-white" title="Delete">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  {/* Format icon */}
                  <button className="text-gray-400 hover:text-white" title="Format">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  </button>
                  {/* Magic wand icon */}
                  <button className="text-gray-400 hover:text-white" title="Magic">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 4V2m0 20v-2m7-7h-2M4 15H2m2.93-7.07l-1.42-1.42m16.97 16.97l-1.42-1.42m16.97-16.97l-1.42 1.42"/><path d="M8 12l4 4 6-6"/></svg>
                  </button>
                </div>
              </div>
              {/* Two-column layout below bar */}
              <div className="flex flex-1 min-h-0">
                {/* Left: code editor */}
                <div className="flex-1 flex bg-[#18181A] min-h-0 border-r border-neutral-900" style={{ fontFamily: 'monospace' }}>
                  {/* Line numbers */}
                  <div className="flex flex-col items-end py-3 px-2 select-none text-zinc-700 text-sm border-r border-neutral-800 min-h-0" style={{ minWidth: 32 }}>
                    {Array.from({ length: (preRequestScript.match(/\n/g)?.length ?? 0) + 1 || 1 }, (_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  {/* Textarea with placeholder on first line */}
                  <div
                    ref={preRequestDivRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    className="flex-1 bg-transparent text-zinc-200 px-3 py-3 text-sm outline-none resize-none h-full min-h-0 font-mono"
                    style={{ fontFamily: 'monospace', border: 'none', whiteSpace: 'pre', overflow: 'auto' }}
                    onInput={e => setPreRequestScript((e.target as HTMLDivElement).innerText)}
                    onPaste={e => {
                      e.preventDefault();
                      const text = e.clipboardData.getData('text/plain');
                      document.execCommand('insertText', false, text);
                    }}
                  >
                    {highlightPreRequestScript(preRequestScript)}
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
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPreRequestSnippet('// Set timestamp variable\nconst currentTime = Date.now();\npw.env.set("timestamp", currentTime.toString());\n'); }}>Environment: Set timestamp variable</a>
                  <a href="#" className="text-blue-500 hover:underline">Environment: Set random number variable</a>
                </div>
              </div>
            </div>
          )}
          {activeTabObj.activeTab === 'post-request' && (
            <div className="flex flex-col flex-1 bg-[#18181A] rounded p-0 mt-2">
              {/* Post-request Script Bar */}
              <div className="flex items-center justify-between px-4 h-10 bg-[#18181A] w-full">
                <span className="text-gray-400 text-base">Post-request Script</span>
                <div className="flex items-center gap-3">
                  {/* Help icon */}
                  <button className="text-gray-400 hover:text-white" title="Help">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  </button>
                  {/* Delete icon */}
                  <button className="text-gray-400 hover:text-white" title="Delete">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  {/* Format icon */}
                  <button className="text-gray-400 hover:text-white" title="Format">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  </button>
                  {/* Magic wand icon */}
                  <button className="text-gray-400 hover:text-white" title="Magic">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 4V2m0 20v-2m7-7h-2M4 15H2m2.93-7.07l-1.42-1.42m16.97 16.97l-1.42-1.42m16.97-16.97l-1.42 1.42"/><path d="M8 12l4 4 6-6"/></svg>
                  </button>
                </div>
              </div>
              {/* Two-column layout below bar */}
              <div className="flex flex-1 min-h-0">
                {/* Left: code editor */}
                <div className="flex-1 flex bg-[#18181A] min-h-0 border-r border-neutral-900" style={{ fontFamily: 'monospace' }}>
                  {/* Line numbers */}
                  <div className="flex flex-col items-end py-3 px-2 select-none text-zinc-700 text-sm border-r border-neutral-800 min-h-0" style={{ minWidth: 32 }}>
                    {Array.from({ length: (postRequestScript.match(/\n/g)?.length ?? 0) + 1 || 1 }, (_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  {/* Contenteditable code editor with syntax highlighting */}
                  <div
                    ref={postRequestDivRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    className="flex-1 bg-transparent text-zinc-200 px-3 py-3 text-sm outline-none resize-none h-full min-h-0 font-mono"
                    style={{ fontFamily: 'monospace', border: 'none', whiteSpace: 'pre', overflow: 'auto' }}
                    onInput={e => setPostRequestScript((e.target as HTMLDivElement).innerText)}
                    onPaste={e => {
                      e.preventDefault();
                      const text = e.clipboardData.getData('text/plain');
                      document.execCommand('insertText', false, text);
                    }}
                  >
                    {highlightPostRequestScript(postRequestScript)}
                  </div>
                </div>
                {/* Right: info panel */}
                <div className="w-[32%] min-w-[300px] flex flex-col items-start p-6 bg-[#18181A]">
                  <span className="text-zinc-400 text-base mb-2">Post-request scripts are written in JavaScript, and are run after the response is received.</span>
                  <a
                    href="https://learning.postman.com/docs/writing-scripts/test-scripts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-zinc-200 hover:underline mb-6"
                  >
                    Read documentation
                  </a>
                  <div className="font-bold text-zinc-300 mb-2">Snippets</div>
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Set an environment variable\n' + 'pw.env.set("variable", "value");\n'); }}>Environment: Set an environment variable</a>
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 200\npw.test("Status code is 200", ()=> {\n    pw.expect(pw.response.status).toBe(200);\n});\n'); }}>Response: Status code is 200</a>
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check JSON response property\npw.test("Check JSON response property", ()=> {\n    pw.expect(pw.response.body.method).toBe("GET");\n});\n'); }}>Response: Assert property from body</a>
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 2xx\npw.test("Status code is 2xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel2xx();\n});\n'); }}>Status code: Status code is 2xx</a>
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 3xx\npw.test("Status code is 3xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel3xx();\n});\n'); }}>Status code: Status code is 3xx</a>
                  <a href="#" className="text-blue-500 hover:underline mb-1" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 4xx\npw.test("Status code is 4xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel4xx();\n});\n'); }}>Status code: Status code is 4xx</a>
                  <a href="#" className="text-blue-500 hover:underline" onClick={e => { e.preventDefault(); insertPostRequestSnippet('// Check status code is 5xx\npw.test("Status code is 5xx", ()=> {\n    pw.expect(pw.response.status).toBeLevel5xx();\n});\n'); }}>Status code: Status code is 5xx</a>
                </div>
              </div>
            </div>
          )}
          {activeTabObj.activeTab === 'variables' && (
            <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
              {/* Variables Bar */}
              <div className="flex items-center gap-3 px-4 h-10 border-b border-neutral-800 relative">
                <span className="text-gray-400 text-sm">Variables</span>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 bg-zinc-800 text-gray-200 text-sm px-3 py-1 rounded border border-zinc-700 focus:outline-none min-w-[90px]"
                    onClick={() => setDropdownOpen(v => !v)}
                  >
                    {contentTypeOptions.find(opt => opt.value === contentType)?.label || 'None'}
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute left-0 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded shadow-lg z-50 py-2 max-h-72 overflow-y-auto"
                      style={{ ...hideScrollbarStyle }}
                    >
                      {contentTypeOptions.map((opt, idx) => (
                        opt.isSection ? (
                          <div key={opt.label} className="px-4 py-1 text-xs text-zinc-500 uppercase tracking-wider select-none">
                            {opt.label}
                          </div>
                        ) : (
                          <button
                            key={opt.value}
                            className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 ${contentType === opt.value ? 'text-violet-400' : 'text-gray-200'}`}
                            onClick={() => { setContentType(opt.value); setDropdownOpen(false); }}
                          >
                            <span className="flex-1">{opt.label}</span>
                            {contentType === opt.value && (
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                            )}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="bg-zinc-800 border border-zinc-700 text-gray-200 text-sm px-3 py-1 rounded ml-2 flex items-center gap-1 focus:outline-none"
                  onClick={() => setActiveTab('headers')}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 12h20"/><path d="M12 2v20"/></svg>
                  Override
                </button>
              </div>
              {/* Variables Content */}
              <div className="px-4 py-6">
                {/* Add your variables content here */}
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
