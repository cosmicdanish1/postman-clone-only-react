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
import useThemeClass from '../../../hooks/useThemeClass';

interface ParametersTabContentProps {
  queryParams: any[];
  handleParamChange: (id: string, field: string, value: string) => void;
  handleDeleteParam: (id: string) => void;
  handleDeleteAllParams: () => void;
  handleAddParam: () => void;
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
  handleDeleteAllParams,
  handleAddParam,
  handleDragEnd,
  SortableParamRow,
}) => {
  const { t } = useTranslation();
  const { themeClass, scrollbarStyles } = useThemeClass();
  const theme = useSelector((state: any) => state.theme.theme);
  const [editActive, setEditActive] = useState(false);
  const [editorValue, setEditorValue] = useState<string>(
    '# Entries are separated by newline\n# Keys and values are separated by :\n# Prepend # to any row you want to add but keep disabled\nkey1:value1\nkey2:value2'
  );


  return (
    <div className={`flex flex-col h-full bg-bg text-text rounded overflow-hidden ${themeClass}`}>
      <style>{scrollbarStyles}</style>
      {/* Query Parameters Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 h-7 border-b border-neutral-800">
        <span className="text-gray-400 text-sm font-semibold">{t('query_parameters')}</span>
        <div className="flex items-center gap-3">
          {/* Help icon */}

          <button
            className="text-gray-400 hover:text-gray-600"
            title={t('help')}
            onClick={() =>
              window.open(
                'https://docs.hoppscotch.io/documentation/features/rest-api-testing',
                '_blank' // opens in new tab
              )
            }
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>




          {/* Delete all icon */}
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            title={t('delete_all')}
            onClick={handleDeleteAllParams}
            disabled={queryParams.length === 0}
          >
            <svg
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              className="svg-icons"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
            </svg>
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
          <button className={`text-gray-400 hover:text-gray-600 ${editActive ? 'text-blue-500' : ''}`} title={t('edit')} onClick={() => setEditActive(v => !v)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
          </button>
          {/* Add icon */}
          <button
            className="text-gray-400 hover:text-gray-600"
            title={t('add')}
            onClick={handleAddParam}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      </div>
      {/* Scrollable Parameters List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Query Parameters Table or Code Editor */}
        {editActive ? (
          <div className="flex-1 flex flex-col rounded-b-2xl p-0 border-t border-neutral-800" style={{ minHeight: '120px', maxWidth: '100%' }}>
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
          <div className="h-64 overflow-y-auto custom-scrollbar">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametersTabContent; 