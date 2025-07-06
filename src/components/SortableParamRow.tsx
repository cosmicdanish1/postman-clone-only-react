import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Parameter } from '../types';

interface SortableParamRowProps {
  param: Parameter;
  handleParamChange: (id: string, field: 'key' | 'value' | 'description', value: string) => void;
  handleDeleteParam: (id: string) => void;
  setFocusedRow: (id: string) => void;
  isOdd: boolean;
}

const SortableParamRow: React.FC<SortableParamRowProps> = ({ param, handleParamChange, handleDeleteParam, setFocusedRow, isOdd }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: param.id });
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
        gridTemplateColumns: '32px 1fr 1fr 1fr auto',
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
        value={param.key}
        placeholder="Key"
        onChange={e => handleParamChange(param.id, 'key', e.target.value)}
        onFocus={() => setFocusedRow(param.id)}
      />
      <input
        className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
        value={param.value}
        placeholder="Value"
        onChange={e => handleParamChange(param.id, 'value', e.target.value)}
      />
      <input
        className="bg-transparent text-white px-2 py-1 outline-none w-full border-r border-neutral-800"
        value={param.description}
        placeholder="Description"
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