// File: ParametersTabContent.tsx
// Type: Component (parameters tab content)
// Imports: React, utility functions, and possibly drag-and-drop helpers
// Imported by: TabContentArea.tsx
// Role: Renders the UI for editing request query parameters in the request editor.
// Located at: src/components/TabContentArea/ParametersTabContent.tsx
import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface ParametersTabContentProps {
  queryParams: any[];
  handleParamChange: (id: string, field: string, value: string) => void;
  handleDeleteParam: (id: string) => void;
  handleDragEnd: (event: any) => void;
  SortableParamRow: any;
}

const getMonacoTheme = (theme: string) => {
  if (theme === 'light') return 'vs-light';
  if (theme === 'dark' || theme === 'system') return 'vs-dark';
  if (theme === 'black') return 'vs-dark'; // or a custom theme if registered
  return 'vs-dark';
};

const ParametersTabContent: React.FC<ParametersTabContentProps> = ({
  queryParams,
  handleParamChange,
  handleDeleteParam,
  handleDragEnd,
  SortableParamRow,
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  const [editActive, setEditActive] = useState(false);
  const [editorValue, setEditorValue] = useState<string>(
    '# Entries are separated by newline\n# Keys and values are separated by :\n# Prepend # to any row you want to add but keep disabled\nkey1:value1\nkey2:value2'
  );
  return (
    <div className={`flex-1 flex flex-col bg-bg text-text rounded  mt-2 ${themeClass}`}>
      {/* Query Parameters Bar */}
      <div className="flex items-center justify-between px-4 h-10  w-full border-b border-neutral-800">
        <span className="text-gray-400 text-base">{t('query_parameters')}</span>
        <div className="flex items-center gap-3">
          {/* Help icon */}
          <button className="text-gray-400 hover:text-white" title={t('help')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </button>
          {/* Delete icon */}
          <button className="text-gray-400 hover:text-white" title={t('delete')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
          </button>
          {/* Animated icon when editActive is true */}
          <AnimatePresence>
            {editActive && (
              <motion.span
                className="inline-block  align-middle mr-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M3 6h18M3 12h15a3 3 0 1 1 0 6h-4"></path><path d="m16 16l-2 2l2 2M3 18h7"></path></g></svg>
              </motion.span>
            )}
          </AnimatePresence>
          {/* Edit icon */}
          <button className={`text-gray-400 hover:text-white ${editActive ? 'text-blue-500' : ''}`} title={t('edit')} onClick={() => setEditActive(v => !v)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
          </button>
          {/* Add icon */}
          <button className="text-gray-400 hover:text-white" title={t('add')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
      </div>
      {/* Query Parameters Table or Code Editor */}
      {editActive ? (
        <div className="flex-1 flex flex-col bg-[#18181A] rounded-b-2xl p-0 border-t border-neutral-800" style={{minHeight: '120px', maxWidth: '100%'}}>
          <style>{`
            .monaco-editor, .monaco-editor-background, .monaco-editor .margin, .monaco-editor .inputarea.ime-input {
              background-color: #18181A !important;
            }
          `}</style>
          <MonacoEditor
            height="100%"
            defaultLanguage="http"
            language="http"
            theme={getMonacoTheme(theme)}
            value={editorValue}
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
            onChange={val => setEditorValue(val || '')}
          />
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={queryParams.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="w-full">
              
              {queryParams.map((param, idx) => (
                <SortableParamRow
                  key={param.id}
                  param={param}
                  handleParamChange={handleParamChange}
                  handleDeleteParam={handleDeleteParam}
                  isOdd={idx % 2 === 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ParametersTabContent; 