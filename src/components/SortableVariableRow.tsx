import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableVariableRowProps {
  variable: { id: string; key: string; value: string };
  handleVariableChange: (id: string, field: 'key' | 'value', value: string) => void;
  handleDeleteVariable: (id: string) => void;
  isOdd: boolean;
}

const SortableVariableRow: React.FC<SortableVariableRowProps> = React.memo(function SortableVariableRow({ variable, handleVariableChange, handleDeleteVariable, isOdd }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: variable.id });
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
      {/* Drag handle: 6-dot rectangle, only visible on hover */}
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
        value={variable.key}
        placeholder="Variable"
        onChange={e => handleVariableChange(variable.id, 'key', e.target.value)}
      />
      <input
        className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
        value={variable.value}
        placeholder="Value"
        onChange={e => handleVariableChange(variable.id, 'value', e.target.value)}
      />
      <div className="flex items-center gap-2 justify-end px-2">
        <button className="text-green-500 hover:text-green-400" tabIndex={-1}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
        </button>
        <button className="text-red-500 hover:text-red-400" onClick={() => handleDeleteVariable(variable.id)} tabIndex={-1}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
});

export default SortableVariableRow; 