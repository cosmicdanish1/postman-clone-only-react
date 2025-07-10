import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Collections from '../pages/Collections';
import History from '../pages/History';
import GenerateCode from '../pages/GenerateCode';

const navItems = [
  {
    key: 'collections',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
    ),
    label: 'Collections',
  },
  {
    key: 'history',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-icon lucide-clock">
        <path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    label: 'History',
  },
  {
    key: 'generate-code',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-icon lucide-code">
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </svg>
    ),
    label: 'Generate Code',
  },
];

const panelContent = {
  'collections': <Collections />,
  'history': <History />,
  'generate-code': <GenerateCode />,
};

const MIN_WIDTH = 260;
const DEFAULT_WIDTH = 340;

const RestRightPanel: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const [activeTab, setActiveTab] = useState('collections');
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(width);

  const onMouseDown = (e: React.MouseEvent, edge: 'left' | 'right') => {
    setDragging(edge);
    startX.current = e.clientX;
    startWidth.current = width;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    let newWidth = startWidth.current;
    const maxWidth = window.innerWidth * 0.5;
    if (dragging === 'left') {
      newWidth = startWidth.current - (e.clientX - startX.current);
    } else if (dragging === 'right') {
      newWidth = startWidth.current + (e.clientX - startX.current);
    }
    newWidth = Math.max(MIN_WIDTH, Math.min(maxWidth, newWidth));
    setWidth(newWidth);
  };

  const onMouseUp = () => {
    setDragging(null);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className={"h-full bg-neutral-900 border-l border-neutral-800 shadow-inner theme-" + theme + " z-[40]"}
      style={{ zIndex: 40, width: width, minWidth: MIN_WIDTH, maxWidth: '50vw', transition: dragging ? 'none' : 'width 0.15s', position: 'relative' }}
    >
      {/* Left drag handle */}
      <div
        style={{ width: 12, height: '100%', cursor: 'ew-resize', background: dragging === 'left' ? '#3b82f6' : '#8884', zIndex: 41, position: 'absolute', left: 0, top: 0, borderRight: '2px solid #3b82f6' }}
        onMouseDown={e => onMouseDown(e, 'left')}
        title="Resize panel"
      />
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Subsidebar */}
        <nav className="w-14 h-full flex flex-col items-center py-4 gap-2 border-r border-border bg-bg">
          {navItems.map(item => (
            <button
              key={item.key}
              aria-label={item.label}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150
                ${activeTab === item.key ? 'bg-blue-900/40 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-blue-400'}`}
              title={item.label}
              onClick={() => setActiveTab(item.key)}
              type="button"
            >
              {item.icon}
            </button>
          ))}
        </nav>
        {/* Panel content */}
        <div className="flex-1 h-full overflow-y-auto">
          {panelContent[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default RestRightPanel; 