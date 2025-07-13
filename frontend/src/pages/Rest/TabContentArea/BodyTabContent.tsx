// File: BodyTabContent.tsx
// Type: Component (body tab content)
// Imports: React, utility functions, and possibly code editor components
// Imported by: TabContentArea.tsx
// Role: Renders the UI for editing the HTTP request body in the request editor.
// Located at: src/components/TabContentArea/BodyTabContent.tsx
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../../hooks/useThemeClass';

interface BodyTabContentProps {
  contentType: string;
  contentTypeOptions: any[];
  setContentType: (type: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  hideScrollbarStyle: React.CSSProperties;
  setActiveTab: (tab: string) => void;
  rawBody: string;
  setRawBody: (body: string) => void;
}

const BodyTabContent: React.FC<BodyTabContentProps> = ({
  contentType,
  contentTypeOptions,
  setContentType,
  dropdownOpen,
  setDropdownOpen,
  hideScrollbarStyle,
  setActiveTab,
  rawBody,
  setRawBody,
}) => {
  const { t } = useTranslation();
  const { themeClass, scrollbarStyles ,borderClass } = useThemeClass();
  const theme = useSelector((state: any) => state.theme.theme);

  const [formRows, setFormRows] = useState([
    { id: Date.now(), key: '', value: '', description: '', enabled: true }
  ]);

  // Drag and drop handlers
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = formRows.findIndex(row => row.id === active.id);
      const newIndex = formRows.findIndex(row => row.id === over.id);
      const updated = [...formRows];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      setFormRows(updated);
    }
  };

  // Auto-add new row when typing in last row
  const handleInputChange = (id: number, field: 'key' | 'value' | 'description', value: string) => {
    setFormRows(prev => {
      const updated = prev.map(row => row.id === id ? { ...row, [field]: value } : row);
      // If editing the last row and any field is non-empty, add a new row
      const last = updated[updated.length - 1];
      if (id === last.id && (last.key || last.value || last.description) && updated.length < 100) {
        updated.push({ id: Date.now() + Math.random(), key: '', value: '', description: '', enabled: true });
      }
      return updated;
    });
  };

  const addRow = () => setFormRows([...formRows, { id: Date.now(), key: '', value: '', description: '', enabled: true }]);
  const deleteRow = (id: number) => setFormRows(formRows.filter(row => row.id !== id));
  const toggleRow = (id: number) => setFormRows(formRows.map(row => row.id === id ? { ...row, enabled: !row.enabled } : row));

  const getMonacoTheme = (theme: string) => {
    if (theme === 'light') return 'vs-light';
    if (theme === 'dark' || theme === 'system') return 'vs-dark';
    if (theme === 'black') return 'vs-dark'; // or a custom theme if registered
    return 'vs-dark';
  };

  return (
    <div className={`flex flex-col h-full bg-bg text-text rounded overflow-hidden ${themeClass}`}>
      <style>{scrollbarStyles}</style>
      {/* Body Bar: Content Type */}
      <div className={`flex items-center gap-3 px-2 h-10 border-b border-neutral-800 relative flex-shrink-0`}>
        <span className="text-gray-400 text-base font-medium">{t('content_type')}</span>
        <div className="relative">
          <button
            className={`flex items-center gap-1 ${themeClass} text-gray-400 text-base font-medium px-3 rounded-sm focus:outline-none min-w-[90px]`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {contentTypeOptions.find(opt => opt.value === contentType)?.label || t('none')}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {dropdownOpen && (
            <div
              className={`absolute left-0 mt-1 w-56 rounded shadow-lg z-50 py-2 max-h-72 overflow-y-auto ${
                theme === 'light' ? 'bg-white border border-gray-200' : 'bg-neutral-800 border border-neutral-700'
              }`}
              style={{ ...hideScrollbarStyle }}
            >
              {contentTypeOptions.map((opt, _) => (
                opt.isSection ? (
                  <div key={opt.label} className={`px-4 py-1 uppercase tracking-wider select-none text-xs ${
                    theme === 'light' ? 'text-gray-500 bg-gray-50' : 'text-gray-400 bg-neutral-700'
                  }`}>
                    {opt.label}
                  </div>
                ) : (
                  <button
                    key={opt.value}
                    className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-200 hover:bg-neutral-700'
                    } ${contentType === opt.value ? 'text-violet-400 font-medium' : ''}`}
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
          className="text-gray-400 text-base font-medium px-3 py-1 rounded ml-2 flex items-center hover:bg-opacity-10 hover:bg-white focus:outline-none transition-colors"
          onClick={() => setActiveTab('headers')}
        >
          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons mr-2">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </g>
          </svg>
          {t('override')}
        </button>
      </div>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Raw Request Body Bar for JSON, XML, HTML, and Plain Text content types */}
          {[
            'application/json',
            'application/ld+json',
            'application/hal+json',
            'application/vnd.api+json',
            'application/xml',
            'text/xml',
            'text/html',
            'text/plain',
          ].includes(contentType) && (
            <>
              <div className="flex items-center justify-between px-4 h-10 bg-[#18181A] w-full border-b border-neutral-800">
                <span className="text-gray-400 text-base">{t('raw_request_body')}</span>
                <div className="flex items-center gap-4">
                  {/* Help icon */}
                  <button className="text-gray-400 hover:text-white" title={t('help')}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
                  </button>
                  {/* Delete icon */}
                  <button className="text-gray-400 hover:text-white" title={t('delete')}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  {/* Format icon */}
                  <button className="text-gray-400 hover:text-white" title={t('format')}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
                  </button>
                  {/* Other icons as needed (add more here to match screenshot) */}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <style>{`
                  .monaco-editor, .monaco-editor-background, .monaco-editor .margin, .monaco-editor .inputarea.ime-input {
                    background-color: #18181A !important;
                  }
                `}</style>
                <MonacoEditor
                  height="100%"
                  defaultLanguage={
                    ['application/xml', 'text/xml'].includes(contentType) ? 'xml' :
                    contentType === 'text/html' ? 'html' :
                    contentType === 'text/plain' ? 'plaintext' :
                    'json'
                  }
                  language={
                    ['application/xml', 'text/xml'].includes(contentType) ? 'xml' :
                    contentType === 'text/html' ? 'html' :
                    contentType === 'text/plain' ? 'plaintext' :
                    'json'
                  }
                  theme={getMonacoTheme(theme)}
                  value={rawBody || (
                    ['application/xml', 'text/xml'].includes(contentType) ? '<root>\n  <!-- Your XML here -->\n</root>' :
                    contentType === 'text/html' ? '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Title</title>\n  </head>\n  <body>\n    <!-- Your HTML here -->\n  </body>\n</html>' :
                    contentType === 'text/plain' ? 'Your plain text here' :
                    '{\n  "key": "value"\n}'
                  )}
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
                  onChange={val => setRawBody(val || '')}
                />
              </div>
            </>
          )}
          {/* Table-based editor for application/x-www-form-urlencoded */}
          {['multipart/form-data', 'application/x-www-form-urlencoded'].includes(contentType) && (
            <>
              <div className="flex items-center justify-between px-4 h-10 bg-[#18181A] w-full border-b border-neutral-800">
                <span className="text-gray-400 text-base">Request Body</span>
                <div className="flex items-center gap-4">
                  {/* Help icon */}
                  <button className="text-gray-400 hover:text-white" title="Help">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
                  </button>
                  {/* Delete icon */}
                  <button className="text-gray-400 hover:text-white" title="Delete">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  {/* Edit icon */}
                  <button className="text-gray-400 hover:text-white" title="Edit">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                  </button>
                  {/* Add icon */}
                  <button className="text-gray-400 hover:text-white" title="Add" onClick={addRow}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={formRows.map(row => row.id)} strategy={verticalListSortingStrategy}>
                    <div className="w-full">
                      <div className="grid grid-cols-4 border-b border-neutral-800 px-2" style={{minHeight: '38px', gridTemplateColumns: '32px 1fr 1fr auto'}}>
                        <div></div>
                        <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Key</div>
                        <div className="text-gray-500 text-sm flex items-center border-r border-neutral-800 py-2">Value</div>
                        <div></div>
                      </div>
                      {formRows.map((row, _) => (
                        <SortableFormRow
                          key={row.id}
                          row={row}
                          onChange={handleInputChange}
                          onDelete={deleteRow}
                          onToggle={toggleRow}
                          isOdd={_ % 2 === 1}
                          index={_}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Empty state when contentType is 'none' */}
      {contentType === 'none' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4">
            <img 
              src={`/images/states/${theme === 'light' ? 'light' : 'black'}/upload_single_file.svg`} 
              loading="lazy" 
              className={`h-24 w-24 ${theme === 'light' ? 'opacity-70' : 'opacity-90'}`} 
              alt="This request does not have a body"
            />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {t('no_request_body')}
          </h3>
          <p className={`text-sm max-w-md mx-auto mb-6 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            {t('no_request_body_description')}
          </p>
          <a
            href="https://learning.postman.com/docs/sending-requests/requests/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            {t('learn_more')}
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

const SortableFormRow = ({ row, onChange, onDelete, onToggle, isOdd, index }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
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
        value={row.key}
        placeholder={`Parameter ${index + 1}`}
        onChange={e => onChange(row.id, 'key', e.target.value)}
      />
      <input
        className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
        value={row.value}
        placeholder={`Value ${index + 1}`}
        onChange={e => onChange(row.id, 'value', e.target.value)}
      />
      <div className="flex items-center gap-2 justify-end px-2">
        <button className="text-green-500 hover:text-green-400" tabIndex={-1} onClick={() => onToggle(row.id)}>
          {row.enabled ? (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          )}
        </button>
        <button className="text-red-500 hover:text-red-400" onClick={() => onDelete(row.id)} tabIndex={-1}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BodyTabContent; 