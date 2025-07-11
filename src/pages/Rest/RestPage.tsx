// File: RestPage.tsx
// Type: Page (REST feature entry)
// Imports: React, various tab and panel components
// Imported by: App.tsx (via route)
// Role: Main entry point for the REST feature, renders the REST request/response UI.
// Located at: src/pages/Rest/RestPage.tsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { arrayMove } from '@dnd-kit/sortable';
import TabsBar from '../../components/TabsBar';
import RequestEditor from './RequestEditor';
import TabContentArea from '../../components/TabContentArea';
import EditEnvironmentModal from '../../components/EditEnvironmentModal';
import SaveAsModal from '../../components/SaveAsModal';
import ImportCurlModal from '../../components/ImportCurlModal';
import GenerateCodeModal from '../../components/GenerateCodeModal';
import { uuidv4 } from '../../utils/helpers';
import SortableParamRow from '../../components/SortableParamRow';
import type { TabData, Parameter, Variable } from '../../types';
import SortableHeaderRow from '../../components/SortableHeaderRow';
import SortableVariableRow from '../../components/SortableVariableRow';
import { METHODS, contentTypeOptions } from '../../constants';
import { useSelector } from 'react-redux';
import RestRightPanel from '../../components/RestRightPanel';
import RestBottomActions from '../../components/RestBottomActions';

const defaultTabData = (): TabData => ({
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
  // Response-related properties
  responseStatus: null,
  responseStatusText: '',
  responseHeaders: [],
  responseBody: '',
  responseTime: null,
  responseSize: null,
  isLoading: false,
  responseError: null,
});

const MIN_RIGHT_WIDTH = 260;
const MAX_RIGHT_WIDTH = 500; // Use fixed limit instead of 50% of window
const DEFAULT_RIGHT_WIDTH = 340;

const HoppscotchClone: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);


    const accentColors = [
    { key: 'green', color: '#22c55e' },
    { key: 'blue', color: '#2563eb' },
    { key: 'cyan', color: '#06b6d4' },
    { key: 'purple', color: '#7c3aed' },
    { key: 'yellow', color: '#eab308' },
    { key: 'orange', color: '#f59e42' },
    { key: 'red', color: '#ef4444' },
    { key: 'pink', color: '#ec4899' },
  ];


 const accentColor = useSelector((state: any) => state.theme.accentColor);

 const accentHex = accentColors.find(c => c.key === accentColor)?.color;


  const [tabs, setTabs] = useState<TabData[]>([defaultTabData()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);
  const [envTab, setEnvTab] = useState<'personal' | 'workspace'>('personal');
  const handleSetEnvTab = (tab: string) => setEnvTab(tab as 'personal' | 'workspace');
  const [showVarsPopover, setShowVarsPopover] = useState(false);
  const [editModal, setEditModal] = useState<null | 'global' | 'environment'>(null);
  const eyeRef = React.useRef<HTMLSpanElement>(null!);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const methodDropdownRef = React.useRef<HTMLDivElement>(null!);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const sendMenuRef = React.useRef<HTMLDivElement>(null!);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveRequestName, setSaveRequestName] = useState('Untitled');
  const [showImportCurlModal, setShowImportCurlModal] = useState(false);
  const [curlInput, setCurlInput] = useState("");
  const [showGenerateCodeModal, setShowGenerateCodeModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Shell - cURL');
  const generatedCode = `curl --request GET \\n  --url https://echo.hoppscotch.io/`;
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const saveDropdownRef = React.useRef<HTMLDivElement>(null!);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null!);

  // Remove the dynamic maxRightWidth calculation - use fixed MAX_RIGHT_WIDTH instead

  // Query Parameters state and handlers
  const [queryParams, setQueryParams] = React.useState<Parameter[]>([
    { id: uuidv4(), key: '', value: '', description: '' }
  ]);

  // Content type options for Body tab
  const [contentType, setContentType] = useState('none');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Add custom style for hiding scrollbar
  const hideScrollbarStyle: React.CSSProperties = {
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
    overflowY: 'auto',
  };

 





  const handleParamChange = (id: string, field: string, value: string): void => {
    setQueryParams(prev => {
      const updated = prev.map((p) => p.id === id ? { ...p, [field]: value } : p);
      // If editing the last row's key and it's non-empty, add a new row with a stable id
      if (field === 'key' && prev[prev.length - 1].id === id && value.trim() !== '') {
        return [...updated, { id: uuidv4(), key: '', value: '', description: '' }];
      }
      return updated;
    });
  };
  const handleDeleteParam = (id: string): void => {
    setQueryParams(prev => prev.length === 1 ? prev : prev.filter((p) => p.id !== id));
  };

  // Drag and drop handlers for Query Parameters
  const handleDragEnd = (event: any): void => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQueryParams((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
  const closeModal = (): void => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, showModal: false } : tab));
  };
  const saveModal = (): void => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, tabName: tab.modalValue, showModal: false } : tab));
  };

  // Add new tab
  const addTab = (): void => {
    const newTab = defaultTabData();
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  // Switch tab
  const switchTab = (id: string): void => setActiveTabId(id);

  // Update method for active tab
  const setMethod = (method: string): void => {
    setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, method } : tab));
  };

  // Update activeTab (Parameters, Body, etc.) for active tab
  const setActiveTab = (tab: string): void => {
    setTabs(tabs => tabs.map(t => t.id === activeTabId ? { ...t, activeTab: tab } : t));
  };

  // Update modal value for renaming
  const setModalValue = (val: string): void => {
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



  
  // Headers state and handlers
  const [editHeadersActive, setEditHeadersActive] = useState(false);
  const handleHeaderChange = (id: string, field: string, value: string): void => {
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
  const handleDeleteHeader = (id: string): void => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      const updatedHeaders = tab.headers.filter((h: any) => h.id !== id || h.locked);
      return { ...tab, headers: updatedHeaders };
    }));
  };
  const handleAddHeader = (): void => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;
      return { ...tab, headers: [...tab.headers, { id: uuidv4(), key: '', value: '', description: '', locked: false }] };
    }));
  };
  // List of common HTTP header names for dropdown
  // Only these options for all editable header rows
  const editableHeaderOptions = [
    'WWW-Authenticate',
    'Authorization',
    'Proxy-Authenticate',
    'Proxy-Authorization',
    'Age',
  ];

  // Add at the top of the component:
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const authDropdownRef = React.useRef<HTMLDivElement>(null!);

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
 
  const [digestAlgDropdownOpen, setDigestAlgDropdownOpen] = useState(false);
  const digestAlgDropdownRef = React.useRef<HTMLDivElement>(null!);

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
  const [hawkAlgDropdownOpen, setHawkAlgDropdownOpen] = useState(false);
  const hawkAlgDropdownRef = React.useRef<HTMLDivElement>(null!);

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


  const [jwtAlgDropdownOpen, setJwtAlgDropdownOpen] = useState(false);
  const jwtAlgDropdownRef = React.useRef<HTMLDivElement>(null!);
 

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
  const preRequestDivRef = useRef<HTMLDivElement>(null!);

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
  const postRequestDivRef = useRef<HTMLDivElement>(null!);

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

  // Add at the top of the component, after queryParams state:
  const [variables, setVariables] = React.useState<Variable[]>([
    { id: uuidv4(), key: '', value: '' }
  ]);

  // Handler for variable changes
  const handleVariableChange = (id: string, field: string, value: string): void => {
    setVariables(prev => {
      const updated = prev.map((v) => v.id === id ? { ...v, [field]: value } : v);
      // If editing the last row and it's non-empty, add a new row
      const last = updated[updated.length - 1];
      if ((last.key !== '' || last.value !== '') && prev.length === updated.length) {
        return [...updated, { id: uuidv4(), key: '', value: '' }];
      }
      return updated;
    });
  };
  const handleDeleteVariable = (id: string): void => {
    setVariables(prev => prev.length === 1 ? prev : prev.filter((v) => v.id !== id));
  };
  const handleVariableDragEnd = (event: any): void => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setVariables((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const [authorization, setAuthorization] = useState('');

  React.useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const container = dividerRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let newWidth = rect.right - e.clientX;
      if (newWidth < MIN_RIGHT_WIDTH) newWidth = MIN_RIGHT_WIDTH;
      if (newWidth > MAX_RIGHT_WIDTH) newWidth = MAX_RIGHT_WIDTH;
      setRightWidth(newWidth);
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [dragging]);

  // State for resizable bottom sheet overlay
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const MIN_OVERLAY_HEIGHT = 80;
  const MAX_OVERLAY_HEIGHT = 400;
  const [overlayHeight, setOverlayHeight] = useState(180);
  const [draggingOverlay, setDraggingOverlay] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(overlayHeight);

  // Stable drag handlers using refs
  const draggingOverlayRef = useRef(draggingOverlay);
  draggingOverlayRef.current = draggingOverlay;

  function onOverlayDragMouseMove(e: MouseEvent) {
    if (!draggingOverlayRef.current) return;
    const delta = dragStartY.current - e.clientY;
    let newHeight = dragStartHeight.current + delta;
    newHeight = Math.max(MIN_OVERLAY_HEIGHT, Math.min(MAX_OVERLAY_HEIGHT, newHeight));
    setOverlayHeight(newHeight);
  }
  function onOverlayDragMouseUp() {
    setDraggingOverlay(false);
    document.removeEventListener('mousemove', onOverlayDragMouseMove);
    document.removeEventListener('mouseup', onOverlayDragMouseUp);
  }
  function onOverlayDragMouseDown(e: React.MouseEvent) {
    setDraggingOverlay(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = overlayHeight;
    document.addEventListener('mousemove', onOverlayDragMouseMove);
    document.addEventListener('mouseup', onOverlayDragMouseUp);
  }

  // Add at the top of the component, after overlayHeight state:
  const [dragBarHover, setDragBarHover] = useState(false);

  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  else themeClass = 'theme-light'; // fallback

  // After themeClass is set:
  const activeTabTextClass = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <div className={`flex flex-col h-full w-full theme-${theme} bg-bg text-text `}>
      {/* Edit Environment Modal */}
      <EditEnvironmentModal
        open={editModal !== null}
        onClose={() => setEditModal(null)}
        modalValue={editModal === 'global' ? 'Global' : 'Environment'}
        setModalValue={() => {}}
        onSave={() => setEditModal(null)}
      />
      {/* Top full-width bar */}
      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitchTab={switchTab}
        onAddTab={addTab}
        onCloseTab={id => {
          setTabs(newTabs => {
            const idx = newTabs.findIndex(tab => tab.id === id);
            if (idx !== -1) {
              newTabs.splice(idx, 1);
              setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
            }
            return newTabs;
          });
        }}
        canClose={tabs.length > 1}
        methodColors={methodColors}
        envDropdownOpen={envDropdownOpen}
        setEnvDropdownOpen={setEnvDropdownOpen}
        showVarsPopover={showVarsPopover}
        setShowVarsPopover={setShowVarsPopover}
        eyeRef={eyeRef}
        envTab={envTab}
        setEnvTab={handleSetEnvTab}
      />

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
      <SaveAsModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        saveRequestName={saveRequestName}
        setSaveRequestName={setSaveRequestName}
        onSave={() => setShowSaveModal(false)}
      />

      {/* Import cURL Modal */}
      <ImportCurlModal
        open={showImportCurlModal}
        onClose={() => setShowImportCurlModal(false)}
        curlInput={curlInput}
        setCurlInput={setCurlInput}
        onImport={() => setShowImportCurlModal(false)}
      />

      {/* Generate code Modal */}
      <GenerateCodeModal
        open={showGenerateCodeModal}
        onClose={() => setShowGenerateCodeModal(false)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        generatedCode={generatedCode}
      />

      {/* Main layout below top bar */}
      <div className="flex flex-col sm:flex-row flex-1 w-full min-h-0">
        {/* Left Content (main panel) */}
        <div className="flex flex-col flex-1 min-h-0 relative" ref={mainPanelRef}>
          <div className="flex flex-col flex-1 p-2 sm:p-4 min-w-0 min-h-0">
            {/* URL bar */}
            <RequestEditor
              METHODS={METHODS}
              method={activeTabObj.method}
              setMethod={setMethod}
              methodDropdownOpen={methodDropdownOpen}
              setMethodDropdownOpen={setMethodDropdownOpen}
              methodDropdownRef={methodDropdownRef}
              methodColors={methodColors}
              url={''}
              setUrl={url => setTabs(tabs => tabs.map(tab => tab.id === activeTabId ? { ...tab, url } : tab))}
              onSend={() => {
                // setShowInterceptorInPanel(false); // Removed as per edit hint
                // setTimeout(() => setShowInterceptorInPanel(true), 1000); // Removed as per edit hint
              }}
              onSendMenuOpen={() => setSendMenuOpen(v => !v)}
              sendMenuOpen={sendMenuOpen}
              sendMenuRef={sendMenuRef}
              onShowImportCurlModal={() => { setShowImportCurlModal(true); setSendMenuOpen(false); }}
              onShowGenerateCodeModal={() => { setShowGenerateCodeModal(true); setSendMenuOpen(false); }}
              onShowSaveModal={() => setShowSaveModal(true)}
              onShowSaveDropdown={() => setShowSaveDropdown(v => !v)}
              showSaveDropdown={showSaveDropdown}
              saveDropdownRef={saveDropdownRef}
              saveRequestName={saveRequestName}
            />
            {/* Tabs */}
            <div className="flex items-center gap-2 text-[14px]  mb-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
              {['parameters', 'body', 'headers', 'authorization', 'pre-request', 'post-request', 'variables'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-2 py-1 font-semibold bg-transparent focus:outline-none"
                  style={{ background: 'none', border: 'none' }}
                >
                  <span className={activeTabObj.activeTab === tab ? activeTabTextClass : 'text-gray-400'}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </span>
                  {activeTabObj.activeTab === tab && (
                    <motion.div
                      layoutId="active-underline"
                      className="absolute left-0"
                      style={{
                        bottom: 0,
                        height: '3px',
                        width: '100%',
                        background: accentHex,
                        marginTop: '4px',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            {/* Tab content area (example: Parameters) */}
            {['parameters', 'body', 'headers', 'authorization', 'pre-request', 'post-request', 'variables'].includes(activeTabObj.activeTab) && (
              <TabContentArea
                activeTab={activeTabObj.activeTab}
                queryParams={queryParams}
                handleParamChange={handleParamChange}
                handleDeleteParam={handleDeleteParam}
                handleDragEnd={handleDragEnd}
                SortableParamRow={SortableParamRow}
                contentType={contentType}
                contentTypeOptions={contentTypeOptions}
                setContentType={setContentType}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                hideScrollbarStyle={hideScrollbarStyle}
                setActiveTab={setActiveTab}
                rawBody={rawBody}
                setRawBody={setRawBody}
                // Headers tab props
                headers={activeTabObj.activeTab === 'headers' ? activeTabObj.headers : []}
                handleHeaderChange={activeTabObj.activeTab === 'headers' ? (handleHeaderChange as (id: string, field: string, value: string) => void) : () => {}}
                handleDeleteHeader={activeTabObj.activeTab === 'headers' ? (handleDeleteHeader as (id: string) => void) : () => {}}
                handleAddHeader={activeTabObj.activeTab === 'headers' ? handleAddHeader : () => {}}
                editHeadersActive={activeTabObj.activeTab === 'headers' ? editHeadersActive : false}
                setEditHeadersActive={activeTabObj.activeTab === 'headers' ? setEditHeadersActive : () => {}}
                SortableHeaderRow={activeTabObj.activeTab === 'headers' ? SortableHeaderRow : () => null}
                uuidv4={uuidv4}
                setTabs={setTabs}
                activeTabId={activeTabId}
                tabs={tabs}
                authorization={authorization}
                setAuthorization={setAuthorization}
                // Pre-request tab props
                preRequestScript={preRequestScript}
                setPreRequestScript={setPreRequestScript}
                insertPreRequestSnippet={insertPreRequestSnippet}
                highlightPreRequestScript={highlightPreRequestScript}
                preRequestDivRef={preRequestDivRef as React.RefObject<HTMLDivElement>}
                // Post-request tab props
                postRequestScript={postRequestScript}
                setPostRequestScript={setPostRequestScript}
                insertPostRequestSnippet={insertPostRequestSnippet}
                highlightPostRequestScript={highlightPostRequestScript}
                postRequestDivRef={postRequestDivRef as React.RefObject<HTMLDivElement>}
                // Variables tab props
                variables={variables}
                handleVariableChange={handleVariableChange as (id: string, field: string, value: string) => void}
                handleDeleteVariable={handleDeleteVariable}
                handleVariableDragEnd={handleVariableDragEnd}
                SortableVariableRow={SortableVariableRow}
              />
            )}
          </div>
          {/* Overlay: resizable bottom sheet RestBottomActions */}
          <div
            className={themeClass}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: overlayHeight,
              zIndex: 50,
              // background removed, now handled by themeClass
              // No boxShadow, no borderRadius for sharp rectangle edges
              transition: draggingOverlay ? 'none' : 'height 0.15s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              pointerEvents: 'auto',
              userSelect: draggingOverlay ? 'none' : 'auto',
            }}
          >
            {/* Drag handle at the top */}
            <div
              onMouseDown={onOverlayDragMouseDown}
              onMouseEnter={() => setDragBarHover(true)}
              onMouseLeave={() => setDragBarHover(false)}
              style={{
                height: dragBarHover ? 4 : 1,
                cursor: 'ns-resize',
                width: '100%',
                margin: '0 0 12px 0',
                borderRadius: 0,
                background: dragBarHover ? accentHex : (draggingOverlay ? '#f472b6' : '#27272a'),
                transition: 'background 0.15s',
              }}
              title="Resize panel"
            ></div>
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              <RestBottomActions />
            </div>
          </div>
        </div>
        {/* Vertical divider for resizing (hide on mobile) */}
        <div
          ref={dividerRef}
          className="w-2 h-full cursor-col-resize bg-border hover:bg-blue-600 transition hidden sm:block"
          onMouseDown={() => setDragging(true)}
          style={{ zIndex: 10 }}
        />
        {/* Right sub sidebar for REST page (hide on mobile) */}
        <div className="flex-none hidden sm:block" style={{ width: rightWidth, minWidth: MIN_RIGHT_WIDTH, maxWidth: MAX_RIGHT_WIDTH, overflow: 'hidden' }}>
          <RestRightPanel />
        </div>
      </div>
      {/* Add the resizable bottom panel here */}
      {/** Only show HelpShortcutPanel in ResizableBottomPanel on sm and up */}
      {/* Removed ResizableBottomPanel and HelpShortcutPanel for debugging */}
    </div>
  );
};

export default HoppscotchClone; 
