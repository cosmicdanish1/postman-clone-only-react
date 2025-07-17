// File: SortableHeaderRow.tsx
// Type: Component (sortable table row for headers)
// Imports: React, utility functions, and possibly drag-and-drop libraries
// Imported by: TabContentArea/HeadersTabContent.tsx, GraphQLTabContentArea.tsx
// Role: Renders a sortable row for HTTP headers in request editors.
// Located at: src/components/SortableHeaderRow.tsx
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export interface SortableHeaderRowProps {
  header: { id: string; key: string; value: string; description: string; locked?: boolean };
  handleHeaderChange: (id: string, field: 'key' | 'value' | 'description', value: string) => void;
  handleDeleteHeader: (id: string) => void;
  handleAddHeader?: () => void;
  isOdd: boolean;
}

const COMMON_HEADERS = [
  'WWW-Authenticate',
  'Authorization', 
  'Proxy-Authenticate',
  'Proxy-Authorization',
  'Age'
];

const SortableHeaderRow: React.FC<SortableHeaderRowProps> = React.memo(function SortableHeaderRow({ header, handleHeaderChange, handleDeleteHeader, handleAddHeader, isOdd }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: header.id });
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState('');
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  const filteredHeaders = COMMON_HEADERS.filter(h => h.toLowerCase().includes((filter || header.key).toLowerCase()) && h !== header.key);
  
  const handleHeaderSelect = (selectedHeader: string) => {
    handleHeaderChange(header.id, 'key', selectedHeader);
    setShowDropdown(false);
    setFilter('');
    // Create a new row after selecting a header
    if (handleAddHeader) {
      setTimeout(() => handleAddHeader(), 100);
    }
  };

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
        borderBottom: '1px solid var(--border, #27272a)',
        paddingLeft: 0,
        paddingRight: 8,
        alignItems: 'center',
      }}
      className={`${isOdd ? 'bg-bg-secondary' : ''} hover:bg-opacity-30 hover:bg-accent/10 transition-colors ${themeClass}`}
    >
      {/* Drag handle: 6-dot rectangle, only visible on hover */}
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center cursor-grab focus:outline-none h-full"
        style={{ background: 'none', border: 'none', padding: 0 }}
        tabIndex={-1}
        title={t('headers.drag_to_reorder')}
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
      <div className="relative">
        <div className="relative h-full">
          <input
            className={`bg-transparent text-text px-3 py-1.5 outline-none w-full h-full focus:ring-2 focus:ring-accent/50 rounded-sm ${header.locked ? 'opacity-70' : ''}`}
            value={header.key}
            placeholder={t('headers.key')}
            onChange={e => {
              handleHeaderChange(header.id, 'key', e.target.value);
              setFilter(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            disabled={header.locked}
            autoComplete="off"
          />
        </div>
        {showDropdown && filteredHeaders.length > 0 && (
          <div className="absolute left-0 top-full z-50 w-full bg-bg border border-border rounded shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredHeaders.map(h => (
              <div
                key={h}
                className="px-3 py-2 text-sm text-text hover:bg-accent/20 hover:text-accent cursor-pointer select-none"
                onMouseDown={() => handleHeaderSelect(h)}
              >
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        className={`bg-transparent text-text px-3 py-1.5 outline-none w-full h-full focus:ring-2 focus:ring-accent/50 rounded-sm ${header.locked ? 'opacity-70' : ''}`}
        value={header.value}
        placeholder={t('headers.value')}
        onChange={e => handleHeaderChange(header.id, 'value', e.target.value)}
        disabled={header.locked}
      />
      <input
        className={`bg-transparent text-text px-3 py-1.5 outline-none w-full h-full focus:ring-2 focus:ring-accent/50 rounded-sm ${header.locked ? 'opacity-70' : ''}`}
        value={header.description}
        placeholder={t('headers.description')}
        onChange={e => handleHeaderChange(header.id, 'description', e.target.value)}
        disabled={header.locked}
      />
      <div className="flex items-center gap-2 justify-end px-2">
        <button 
          className="text-green-500 hover:text-green-400 p-1 rounded-full hover:bg-green-500/10 transition-colors" 
          title={t('headers.save')}
          tabIndex={-1}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </button>
        <button 
          className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors" 
          onClick={(e) => {
            e.preventDefault();
            handleDeleteHeader(header.id);
          }} 
          title={t('headers.delete')}
          tabIndex={-1}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default SortableHeaderRow; 