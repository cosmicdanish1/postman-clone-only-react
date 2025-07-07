import React, { useRef, useLayoutEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';

interface Tab {
  id: string;
  tabName: string;
  showModal: boolean;
  modalValue: string;
}

interface GraphQLTabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSwitchTab: (id: string) => void;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onOpenModal: (id: string) => void;
  onCloseModal: (id: string) => void;
  onSaveModal: (id: string) => void;
  onSetModalValue: (id: string, val: string) => void;
}

const GraphQLTabBar: React.FC<GraphQLTabBarProps> = ({
  tabs,
  activeTabId,
  onSwitchTab,
  onAddTab,
  onCloseTab,
  onOpenModal,
  onCloseModal,
  onSaveModal,
  onSetModalValue,
}) => {
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const barRef = useRef<HTMLDivElement | null>(null);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [hoveredCloseId, setHoveredCloseId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTabId];
    if (el) {
      const { left, width } = el.getBoundingClientRect();
      const parentLeft = el.parentElement?.getBoundingClientRect().left || 0;
      setBarStyle({ left: left - parentLeft, width });
    }
  }, [activeTabId, tabs.length]);

  return (
    <div className="w-full bg-[#1C1C1E] border-b h-10 border-zinc-800 relative flex items-center overflow-x-auto">
      <div className="flex items-center flex-1 min-w-0 relative" style={{ position: 'relative' }}>
        {/* Animated blue bar on top */}
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            top: 0,
            left: barStyle.left,
            width: barStyle.width,
            height: 3,
            background: '#3b82f6',
            borderRadius: '3px 3px 0 0',
            transition: 'left 0.25s cubic-bezier(.4,1,.4,1), width 0.25s cubic-bezier(.4,1,.4,1)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              ref={el => (tabRefs.current[tab.id] = el)}
              className={`flex items-center h-10 cursor-pointer select-none border-b-2 transition relative group ${isActive ? 'bg-[#18181b] text-white font-bold' : 'border-transparent text-gray-400 hover:text-white'}`}
              style={{ minWidth: 160, maxWidth: 240, width: 200, paddingLeft: 24, paddingRight: 24 }}
              onClick={() => onSwitchTab(tab.id)}
              onDoubleClick={() => onOpenModal(tab.id)}
              onMouseEnter={() => setHoveredTabId(tab.id)}
              onMouseLeave={() => { setHoveredTabId(null); setHoveredCloseId(null); }}
            >
              <span className="truncate max-w-[120px]" style={{ zIndex: 20, position: 'relative' }}>{tab.tabName}</span>
              {tabs.length > 1 && (
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5"
                  style={{ zIndex: 20 }}
                  onMouseEnter={e => { e.stopPropagation(); setHoveredCloseId(tab.id); }}
                  onMouseLeave={e => { e.stopPropagation(); setHoveredCloseId(null); }}
                  onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
                >
                  {hoveredTabId === tab.id ? (
                    hoveredCloseId === tab.id ? (
                      <svg width="16" height="16" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-500 opacity-70 group-hover:opacity-100 transition" />
                    )
                  ) : null}
                </span>
              )}
              {/* Rename modal */}
              {tab.showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-[#18181b] rounded-2xl shadow-2xl border border-zinc-800 w-[400px] max-w-full p-0 relative">
                    {/* Title and close */}
                    <div className="flex items-center justify-center pt-6 pb-2 px-6 relative">
                      <div className="text-xl font-bold text-center flex-1">Edit Request</div>
                      <button className="absolute right-6 top-6 text-gray-400 hover:text-white text-2xl" onClick={() => onCloseModal(tab.id)}>&times;</button>
                    </div>
                    {/* Label and input */}
                    <div className="px-6 pb-2 pt-2">
                      <label className="block text-xs text-gray-400 mb-1">Label</label>
                      <div className="relative">
                        <input
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-white text-base pr-10 focus:outline-none"
                          value={tab.modalValue}
                          onChange={e => onSetModalValue(tab.id, e.target.value)}
                          autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') onSaveModal(tab.id); if (e.key === 'Escape') onCloseModal(tab.id); }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
                        </span>
                      </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-3 justify-start px-6 pb-6 pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold text-base" onClick={() => onSaveModal(tab.id)}>Save</button>
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded font-semibold text-base" onClick={() => onCloseModal(tab.id)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <span
          className="flex items-center justify-center h-10 w-10 text-blue-500 text-2xl cursor-pointer hover:bg-[#232326] transition rounded-t-md"
          onClick={onAddTab}
          style={{ zIndex: 20 }}
        >
          <FiPlus />
        </span>
      </div>
    </div>
  );
};

export default GraphQLTabBar; 