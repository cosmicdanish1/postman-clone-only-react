// File: SortableVariableRow.tsx
// Type: Component (sortable table row for variables)
// Imports: React, useSortable (dnd-kit), CSS utilities
// Imported by: VariablesTabContent.tsx
// Role: Renders a sortable row for variables in the variables tab, supporting drag-and-drop reordering.
// Located at: src/pages/Rest/TabContentArea/SortableVariableRow.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../../hooks/useThemeClass';

export interface SortableVariableRowProps {
  variable: { id: string; key: string; value: string };
  handleVariableChange: (id: string, field: 'key' | 'value', value: string) => void;
  handleDeleteVariable: (id: string) => void;
}

const SortableVariableRow: React.FC<SortableVariableRowProps> = React.memo(function SortableVariableRow({ variable, handleVariableChange, handleDeleteVariable }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: variable.id });
  const { t } = useTranslation();
  const { textClass, isDarkMode } = useThemeClass();

  // Return consistent background based on theme
  const getRowBackground = () => {
    if (isDragging) {
      return isDarkMode 
        ? 'bg-neutral-800/80' 
        : 'bg-gray-100/80';
    }
    return isDarkMode 
      ? 'bg-neutral-800' 
      : 'bg-white';
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[38px] grid items-center px-2 group
        ${getRowBackground()} ${isDarkMode ? 'border-b border-neutral-700' : 'border-b border-gray-200'}
        transition-all duration-200
      `}
      style={{
        gridTemplateColumns: '32px 1fr 1fr auto',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      {/* Drag handle: 6-dot rectangle, only visible on hover */}
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center cursor-grab focus:outline-none h-full"
        style={{ background: 'none', border: 'none', padding: 0 }}
        tabIndex={-1}
        title={t('drag_to_reorder')}
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
        className={`
          bg-transparent px-2 py-1 outline-none w-full
          ${textClass} ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}
          border-r ${isDarkMode ? 'border-neutral-700' : 'border-gray-200'}
          focus:ring-1 focus:ring-opacity-50 focus:ring-blue-500
          transition-colors duration-200
        `}
        value={variable.key}
        placeholder={t('variable')}
        onChange={e => handleVariableChange(variable.id, 'key', e.target.value)}
      />
      <input
        className={`
          bg-transparent px-2 py-1 outline-none w-full
          ${textClass} ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}
          border-r ${isDarkMode ? 'border-neutral-700' : 'border-gray-200'}
          focus:ring-1 focus:ring-opacity-50 focus:ring-blue-500
          transition-colors duration-200
        `}
        value={variable.value}
        placeholder={t('value')}
        onChange={e => handleVariableChange(variable.id, 'value', e.target.value)}
      />
      <div className="flex items-center gap-2 justify-end px-2">
        <button
          className="text-green-500 hover:text-green-400 transition-colors"
          tabIndex={-1}
          aria-label={t('save')}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </button>
        <button
          className="text-red-500 hover:text-red-400 transition-colors"
          onClick={() => handleDeleteVariable(variable.id)}
          tabIndex={-1}
          aria-label={t('delete')}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default SortableVariableRow;