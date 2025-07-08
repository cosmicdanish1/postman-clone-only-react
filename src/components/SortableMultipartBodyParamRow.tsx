// File: SortableMultipartBodyParamRow.tsx
// Type: Component (sortable table row for multipart body parameters)
// Imports: React, useSortable (dnd-kit), CSS utilities
// Imported by: BodyTabContent.tsx
// Role: Renders a sortable row for multipart body parameters in the body tab, supporting drag-and-drop reordering.
// Located at: src/components/SortableMultipartBodyParamRow.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export type SortableMultipartBodyParamRowProps = {
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

const SortableMultipartBodyParamRow: React.FC<SortableMultipartBodyParamRowProps> = React.memo(function SortableMultipartBodyParamRow({ param, handleMultipartBodyParamChange, handleDeleteMultipartBodyParam, handleMultipartFileChange, handleMultipartContentTypeChange, isOdd, showContentType }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: param.id });
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isOdd ? 'var(--bg-secondary, #19191b)' : undefined,
        minHeight: '38px',
        display: 'grid',
        gridTemplateColumns: showContentType ? '32px 1fr 1fr 1fr auto' : '32px 1fr 1fr auto',
        borderBottom: '1px solid var(--border, #27272a)',
        paddingLeft: 0,
        paddingRight: 8,
        alignItems: 'center',
      }}
      className={`px-2 group text-text ${themeClass}`}
    >
      {/* Drag handle */}
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
        className="bg-transparent text-text px-2 py-1 outline-none w-full border-r border-border"
        value={param.key}
        placeholder={t('key')}
        onChange={e => handleMultipartBodyParamChange(param.id, 'key', e.target.value)}
      />
      <input
        className="bg-transparent text-text px-2 py-1 outline-none w-full border-r border-border"
        value={param.value}
        placeholder={t('value')}
        onChange={e => handleMultipartBodyParamChange(param.id, 'value', e.target.value)}
      />
      {showContentType && (
        <input
          className="bg-transparent text-text px-2 py-1 outline-none w-full border-r border-border"
          value={param.contentType}
          placeholder={t('content_type')}
          onChange={e => handleMultipartContentTypeChange(param.id, e.target.value)}
        />
      )}
      <div className="flex items-center gap-2 justify-end px-2">
        <input
          type="file"
          className="hidden"
          id={`file-input-${param.id}`}
          onChange={e => handleMultipartFileChange(param.id, e.target.files ? e.target.files[0] : null)}
        />
        <label htmlFor={`file-input-${param.id}`} className="text-blue-400 hover:underline cursor-pointer">
          {param.file ? param.file.name : t('attach_file')}
        </label>
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

export default SortableMultipartBodyParamRow; 