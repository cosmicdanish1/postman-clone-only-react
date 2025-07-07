import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CommunicationTab from './CommunicationTab';

const initialProtocols = [
  { id: 1, name: 'Protocol 1' },
  { id: 2, name: 'Protocol 2' },
];

function SortableProtocolRow({ protocol, onNameChange, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: protocol.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? '#232329' : undefined,
      }}
      className="flex items-center  justify-between px-2 py-2 hover:bg-[#232329]"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center cursor-grab focus:outline-none h-full mr-2"
        style={{ background: 'none', border: 'none', padding: 0 }}
        tabIndex={-1}
        title="Drag to reorder"
      >
        <span className="inline-block opacity-70">
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
        className="bg-transparent text-gray-400 flex-1 outline-none border-none px-0 py-0"
        value={protocol.name}
        onChange={e => onNameChange(protocol.id, e.target.value)}
        placeholder="Protocol name"
      />
      <div className="flex items-center gap-4 ml-2">
        <span className="material-icons text-green-400 cursor-pointer" title="Active">check_circle</span>
        <button className="text-red-400 hover:text-red-600" title="Delete" onClick={() => onDelete(protocol.id)}>
          <span className="material-icons">delete</span>
        </button>
      </div>
    </div>
  );
}

const WebSocketPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'communication' | 'protocols'>('communication');
  const [message, setMessage] = useState(`{
  "id": 1
}`);
  const [protocols, setProtocols] = useState(initialProtocols);
  const [nextId, setNextId] = useState(3);

  const handleDelete = (id: number) => {
    setProtocols(protocols.filter(p => p.id !== id));
  };

  const handleAdd = () => {
    setProtocols([...protocols, { id: nextId, name: '' }]);
    setNextId(nextId + 1);
  };

  const handleNameChange = (id: number, value: string) => {
    setProtocols(protocols.map(p => p.id === id ? { ...p, name: value } : p));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = protocols.findIndex(p => p.id === Number(active.id));
      const newIndex = protocols.findIndex(p => p.id === Number(over.id));
      setProtocols(arrayMove(protocols, oldIndex, newIndex));
    }
  };

  const handleDeleteAll = () => {
    setProtocols([]);
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-900 rounded p-4 mt-2">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 bg-gray-800  border-none rounded px-4 py-2 text-white focus:outline-none"
          placeholder="wss://echo-websocket.hoppscotch.io"
          defaultValue="wss://echo-websocket.hoppscotch.io"
          style={{ minWidth: 0 }}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
      </div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-800 mb-2">
        <button
          className={`px-2 py-1 border-b-2 font-semibold transition-colors ${activeTab === 'communication' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('communication')}
        >
          Communication
        </button>
        <button
          className={`px-2 py-1 border-b-2 font-semibold transition-colors ${activeTab === 'protocols' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('protocols')}
        >
          Protocols
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'communication' ? (
        <CommunicationTab message={message} setMessage={setMessage} />
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Protocols Bar */}
          <div className="flex items-center justify-between border-b border-[#232329] px-2 py-1 mb-2">
            <span className="text-gray-400 font-medium">Protocols</span>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white" title="Delete All" onClick={handleDeleteAll}>
                <span className="material-icons">delete</span>
              </button>
              <button className="text-gray-400 hover:text-white" title="Add" onClick={handleAdd}>
                <span className="material-icons">add</span>
              </button>
            </div>
          </div>
          {/* Protocols List with DnD-kit */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={protocols.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col divide-y divide-[#232329]">
                {protocols.map(protocol => (
                  <SortableProtocolRow
                    key={protocol.id}
                    protocol={protocol}
                    onNameChange={handleNameChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default WebSocketPanel; 