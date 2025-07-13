// File: RestPage.tsx
// Type: Page (REST feature entry)
// Imports: React, various tab and panel components
// Imported by: App.tsx (via route)
// Role: Main entry point for the REST feature, renders the REST request/UI.
// Located at: src/pages/Rest/RestPage.tsx
import React, { useState, useRef } from 'react';
import { useRestTabs } from '../../hooks/useRestTabs';
import { motion } from 'framer-motion';
import { arrayMove } from '@dnd-kit/sortable';
import RestTabsHeader from './components/RestTabsHeader';
import RequestEditor from './RequestEditor';
import EditEnvironmentModal from '../../components/modals/EditEnvironmentModal';
import SaveAsModal from '../../components/modals/SaveAsModal';
import ImportCurlModal from '../../components/modals/ImportCurlModal';
import GenerateCodeModal from '../../components/modals/GenerateCodeModal';
import TabContentArea from './TabContentArea/TabContentArea';

import { uuidv4 } from '../../utils/helpers';
import SortableParamRow from '../../components/SortableParamRow';
import type { Parameter, Variable } from '../../types';
import SortableHeaderRow from '../../components/SortableHeaderRow';
import SortableVariableRow from '../../components/SortableVariableRow';
import { METHODS, contentTypeOptions } from '../../constants';
import RestRightPanel from './RightPanel/RestRightPanel';
import RestSplitPane from './components/RestSplitPane';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import useAccentColor from '../../hooks/useAccentColor';
import useThemeClass from '../../hooks/useThemeClass';


const HoppscotchClone: React.FC = () => {
  const { themeClass, isDarkMode } = useThemeClass();
  const { current: accentHex } = useAccentColor();


  const { 
    tabs, 
    setTabs, 
    activeTabId, 
    setActiveTabId, 
    activeTabObj, 
    addTab, 
    switchTab, 
    setMethod, 
    setUrl, 
    setActiveTab,
    setAuthorization 
  } = useRestTabs();
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
  // Right side resizing now handled by useDragResize inside RestSplitPane

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

  const handleDeleteAllParams = (): void => {
    setQueryParams([{ id: uuidv4(), key: '', value: '', description: '' }]);
  };

  const handleAddParam = (): void => {
    setQueryParams(prev => [...prev, { id: uuidv4(), key: '', value: '', description: '' }]);
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

  // Close method dropdown via reusable hook
  useOutsideClick(methodDropdownRef, methodDropdownOpen, () => setMethodDropdownOpen(false));

  // Close send menu via reusable hook
  useOutsideClick(sendMenuRef, sendMenuOpen, () => setSendMenuOpen(false));

  // Close save dropdown via reusable hook
  useOutsideClick(saveDropdownRef, showSaveDropdown, () => setShowSaveDropdown(false));

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

  // State for resizable bottom sheet overlay

  const MIN_OVERLAY_HEIGHT = 80;
  const MAX_OVERLAY_HEIGHT = 400;
  const [overlayHeight, setOverlayHeight] = useState(180);

  // Add at the top of the component, after overlayHeight state:
  const [dragBarHover, setDragBarHover] = useState(false);
  const activeTabTextClass = isDarkMode ? 'text-white' : 'text-black';

  return (
    <div className={`flex flex-col h-full w-full ${themeClass} bg-bg text-text`}>
      

      
<EditEnvironmentModal
        open={editModal !== null}
        onClose={() => setEditModal(null)}
        modalValue={editModal === 'global' ? 'Global' : 'Environment'}
        setModalValue={() => {}}
        onSave={() => setEditModal(null)}
      />
      {/* Top full-width bar */}
      <RestTabsHeader
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


      
      
<SaveAsModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        saveRequestName={saveRequestName}
        setSaveRequestName={setSaveRequestName}
        onSave={() => setShowSaveModal(false)}
      />

      
      
<ImportCurlModal
        open={showImportCurlModal}
        onClose={() => setShowImportCurlModal(false)}
        curlInput={curlInput}
        setCurlInput={setCurlInput}
        onImport={() => setShowImportCurlModal(false)}
      />

      
      
<GenerateCodeModal
        open={showGenerateCodeModal}
        onClose={() => setShowGenerateCodeModal(false)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        generatedCode={generatedCode}
      />

      {/* Main layout below top bar */}
      <RestSplitPane right={<RestRightPanel />}>
        <div className="flex flex-col h-full">
          {/* Top full-width bar */}
          <RequestEditor
            METHODS={METHODS}
            method={activeTabObj.method}
            setMethod={setMethod}
            methodDropdownOpen={methodDropdownOpen}
            setMethodDropdownOpen={setMethodDropdownOpen}
            methodDropdownRef={methodDropdownRef}
            methodColors={methodColors}
            url={activeTabObj.url || ''}
            setUrl={setUrl}
            onSend={() => {
              // Handle send request with current URL and method
              console.log('Sending request to:', activeTabObj.url, 'with method:', activeTabObj.method);
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
          {/* Tabs - Fixed header */}
          <div className="sticky top-0 z-10 bg-bg border-b border-neutral-800">
            <div className="flex items-center gap-2 text-[14px] px-4 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
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
                      background: accentHex as string,
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
          </div>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {['parameters', 'body', 'headers', 'authorization', 'pre-request', 'post-request', 'variables'].includes(activeTabObj.activeTab) && (
            <TabContentArea
              activeTab={activeTabObj.activeTab}
              queryParams={queryParams}
              handleParamChange={handleParamChange}
              handleDeleteParam={handleDeleteParam}
              handleDeleteAllParams={handleDeleteAllParams}
              handleAddParam={handleAddParam}
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
              authorization={activeTabObj.authorization}
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
          </div>
          {/* Bottom panel and drag line removed */}
        </div>
      </RestSplitPane>
    </div>

  );
};

export default HoppscotchClone;
