// File: VariablesTabContent.tsx
// Type: Component (variables tab content)
// Imports: React, utility functions, and possibly drag-and-drop helpers
// Imported by: TabContentArea.tsx
// Role: Renders the UI for editing environment or request variables in the request editor.
// Located at: src/components/TabContentArea/VariablesTabContent.tsx
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface VariablesTabContentProps {
  variables: any[];
  handleVariableChange: (id: string, field: string, value: string) => void;
  handleDeleteVariable: (id: string) => void;
  handleVariableDragEnd: (event: any) => void;
  SortableVariableRow: any;
}

const VariablesTabContent: React.FC<VariablesTabContentProps> = ({
  variables,
  handleVariableChange,
  handleDeleteVariable,
  handleVariableDragEnd,
  SortableVariableRow,
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`flex-1 flex flex-col bg-bg text-text rounded p-0 mt-2 ${themeClass}`}>
      {/* Variables Bar */}
      <div className="flex items-center justify-between px-4 h-10  w-full">
        <span className="text-gray-400 text-base">{t('request_variables')}</span>
        <div className="flex items-center gap-3">
          {/* Help icon */}
          <button className="text-gray-400 hover:text-white" title={t('help')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </button>
          {/* Delete icon */}
          <button className="text-gray-400 hover:text-white" title={t('delete')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
          </button>
          {/* Edit icon */}
          <button className="text-gray-400 hover:text-white" title={t('edit')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
          </button>
          {/* Add icon */}
          <button className="text-gray-400 hover:text-white" title={t('add')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
      </div>
      {/* Variables Table with DnD */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleVariableDragEnd}>
        <SortableContext items={variables.map((v: any) => v.id)} strategy={verticalListSortingStrategy}>
          <div className="w-full">
            <div className="grid grid-cols-4 border-b " style={{minHeight: '3px', gridTemplateColumns: '32px 1fr 1fr 48px'}}>
              
            </div>
            {variables.map((variable: any) => (
              <SortableVariableRow
                key={variable.id}
                variable={variable}
                handleVariableChange={handleVariableChange}
                handleDeleteVariable={handleDeleteVariable}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default VariablesTabContent; 