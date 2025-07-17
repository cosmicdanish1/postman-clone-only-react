// File: SortableParamRow.tsx
// Type: Component (sortable table row for query parameters)
// Imports: React, useSortable (dnd-kit), CSS utilities
// Imported by: ParametersTabContent.tsx
// Role: Renders a sortable row for query parameters in the parameters tab, supporting drag-and-drop reordering.
// Located at: src/components/SortableParamRow.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Parameter } from '../types';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../hooks/useThemeClass';

interface SortableParamRowProps {
  param: Parameter;
  handleParamChange: (id: string, field: 'key' | 'value' | 'description', value: string) => void;
  handleDeleteParam: (id: string) => void;
  setFocusedRow: (id: string) => void;
  isOdd: boolean;
}

const SortableParamRow: React.FC<SortableParamRowProps> = ({ param, handleParamChange, handleDeleteParam, setFocusedRow, isOdd }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: param.id });
  const { t } = useTranslation();
  const { themeClass, textClass} = useThemeClass();
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        minHeight: '38px',
        display: 'grid',
        gridTemplateColumns: '32px 1fr 1fr 1fr auto',
        borderBottom: `1px solid ${themeClass === 'theme-black' ? '#2c2c2e' : themeClass === 'theme-dark' ? '#27272a' : '#e5e7eb'}`,
        paddingLeft: 0,
        paddingRight: 8,
        alignItems: 'center',
      }}
      className={`px-2 group ${textClass} ${isOdd ? (themeClass === 'theme-black' ? 'bg-[#1c1c1e]' : themeClass === 'theme-dark' ? 'bg-[#19191b]' : 'bg-gray-50') : 'bg-transparent'}`}
    >
      {/* Drag handle: 6-dot rectangle, only visible on hover */}
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center cursor-grab focus:outline-none h-full"
        style={{ background: 'none', border: 'none', padding: 0 }}
        tabIndex={-1}
        title={t('params.drag_to_reorder')}
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
        className={`bg-transparent ${textClass} px-2 py-1 outline-none w-full border-r `}
        value={param.key}
        placeholder={t('params.key')}
        onChange={e => handleParamChange(param.id, 'key', e.target.value)}
        onFocus={() => setFocusedRow(param.id)}
      />
      <input
        className={`bg-transparent ${textClass} px-2 py-1 outline-none w-full border-r `}
        value={param.value}
        placeholder={t('params.value')}
        onChange={e => handleParamChange(param.id, 'value', e.target.value)}
      />
      <input
        className={`bg-transparent ${textClass} px-2 py-1 outline-none w-full border-r `}
        value={param.description}
        placeholder={t('params.description')}
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
};

export default SortableParamRow; 