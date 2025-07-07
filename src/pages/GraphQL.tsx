import React, { useState, useRef, useLayoutEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiHelpCircle, FiTrash2, FiEdit2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import MonacoEditor from '@monaco-editor/react';
import GraphQLTopBar from '../components/GraphQL/GraphQLTopBar';
import GraphQLTabBar from '../components/GraphQL/GraphQLTabBar';
import GraphQLSecondaryTabBar from '../components/GraphQL/GraphQLSecondaryTabBar';
import GraphQLTabContentArea from '../components/GraphQL/GraphQLTabContentArea';
import GraphQLHelpPanel from '../components/GraphQL/GraphQLHelpPanel';

interface Variable {
  id: string;
  name: string;
  value: string;
  description: string;
}

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  locked: boolean;
}

function uuidv4() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

const defaultTabData = () => ({
  id: uuidv4(),
  tabName: 'Untitled',
  showModal: false,
  modalValue: 'Untitled',
  activeTab: 'query',
  query: '',
  variables: '',
  headers: [
    { key: '', value: '' }
  ],
});

const GraphQL: React.FC = () => {
  const [tabs, setTabs] = useState([defaultTabData()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [hoveredCloseId, setHoveredCloseId] = useState<string | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const barRef = useRef<HTMLDivElement | null>(null);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

  // Modal logic for renaming tab
  const openModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, modalValue: tab.tabName, showModal: true } : tab));
  };
  const closeModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, showModal: false } : tab));
  };
  const saveModal = (id: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, tabName: tab.modalValue, showModal: false } : tab));
  };
  const setModalValue = (id: string, val: string) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, modalValue: val } : tab));
  };

  // Add new tab
  const addTab = () => {
    const newTab = defaultTabData();
    setTabs(prev => {
      setTimeout(() => setActiveTabId(newTab.id), 0); // ensure DOM update
      return [...prev, newTab];
    });
  };

  // Switch tab
  const switchTab = (id: string) => setActiveTabId(id);

  // Close tab
  const closeTab = (id: string) => {
    setTabs(tabs => {
      const idx = tabs.findIndex(t => t.id === id);
      const newTabs = tabs.filter(t => t.id !== id);
      if (id === activeTabId && newTabs.length > 0) {
        setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
      }
      return newTabs;
    });
  };

  // Tab content state handlers
  const updateTab = (id: string, field: string, value: any) => {
    setTabs(tabs => tabs.map(tab => tab.id === id ? { ...tab, [field]: value } : tab));
  };

  // Header handlers for active tab
  const addHeader = () => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, headers: [...tab.headers, { id: uuidv4(), key: '', value: '', description: '' }] }
        : tab
    ));
  };
  const updateHeader = (headerId: string, field: string, value: string) => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, headers: tab.headers.map(h => h.id === headerId ? { ...h, [field]: value } : h) }
        : tab
    ));
  };
  const deleteHeader = (headerId: string) => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, headers: tab.headers.filter(h => h.id !== headerId) }
        : tab
    ));
  };

  // Get active tab object
  const activeTabObj = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  // Animate blue bar on tab change
  useLayoutEffect(() => {
    const el = tabRefs.current[activeTabId];
    if (el) {
      const { left, width } = el.getBoundingClientRect();
      const parentLeft = el.parentElement?.getBoundingClientRect().left || 0;
      setBarStyle({ left: left - parentLeft, width });
    }
  }, [activeTabId, tabs.length]);

  return (
    <div className="flex h-full w-full bg-[#18181b] text-white">
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <GraphQLTopBar />
        {/* Tab bar */}
        <GraphQLTabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitchTab={switchTab}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onOpenModal={openModal}
          onCloseModal={closeModal}
          onSaveModal={saveModal}
          onSetModalValue={setModalValue}
        />
        {/* Secondary tab bar */}
        <GraphQLSecondaryTabBar
          activeTab={activeTabObj.activeTab}
          onChange={tab => updateTab(activeTabId, 'activeTab', tab)}
        />
        {/* Tab Content */}
        <div className="flex flex-1">
          {/* Left: Tab content */}
          <GraphQLTabContentArea
            activeTabObj={activeTabObj}
            activeTabId={activeTabId}
            updateTab={updateTab}
          />
          {/* Right: Help/Shortcuts Panel */}
          <GraphQLHelpPanel />
        </div>
      </div>
    </div>
  );
};

// Sortable Variable Row Component
const SortableVariableRow: React.FC<{
  variable: Variable;
  onUpdate: (id: string, field: keyof Variable, value: string) => void;
  onDelete: (id: string) => void;
}> = ({ variable, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variable.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-gray-800 rounded cursor-move hover:bg-gray-700"
    >
      <div className="text-gray-400 cursor-move">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <input
        type="text"
        value={variable.name}
        onChange={(e) => onUpdate(variable.id, 'name', e.target.value)}
        placeholder="Variable name"
        className="flex-1 bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        value={variable.value}
        onChange={(e) => onUpdate(variable.id, 'value', e.target.value)}
        placeholder="Variable value"
        className="flex-1 bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <input
        type="text"
        value={variable.description}
        onChange={(e) => onUpdate(variable.id, 'description', e.target.value)}
        placeholder="Description"
        className="flex-1 bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => onDelete(variable.id)}
        className="text-red-400 hover:text-red-300 p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default GraphQL; 