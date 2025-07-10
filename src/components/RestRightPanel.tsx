import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Collections from '../pages/Collections';
import History from '../pages/History';
import GenerateCode from '../pages/GenerateCode';
import { getThemeStyles } from '../utils/getThemeStyles';

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
const MAX_WIDTH = 500; // Limited maximum width

const RestRightPanel: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const accentColor = useSelector((state: any) => state.theme.accentColor);
  const [activeTab, setActiveTab] = useState('collections');
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const [hovered, setHovered] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  // 🟡 Theme and Accent Color Setup
  const accentColors = [
    { key: 'green', color: '#22c55e' },
    { key: 'blue', color: '#2563eb' },
    { key: 'cyan', color: '#06b6d4' },
    { key: 'purple', color: '#7c3aed' },
    { key: 'yellow', color: '#eab308' },
    { key: 'orange', color: '#f59e42' },
    { key: 'red', color: '#ef4444' },
    { key: 'pink', color: '#ec4899' },
  ];

  const accentHex = accentColors.find(c => c.key === accentColor)?.color;

  // 🟡 Dynamic classes based on theme
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

  let borderClass = 'border-l border-neutral-700';
  if (theme === 'black') {
    borderClass = 'border-l border-neutral-800';
  } else if (theme === 'light') {
    borderClass = 'border-l border-gray-200';
  }

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
    if (dragging === 'left') {
      newWidth = startWidth.current - (e.clientX - startX.current);
    } else if (dragging === 'right') {
      newWidth = startWidth.current + (e.clientX - startX.current);
    }
    // Limited drag range - only allow small adjustments
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setWidth(newWidth);
  };

  const onMouseUp = () => {
    setDragging(null);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className={`h-full bg-bg text-text shadow-inner z-30 ${themeClass} ${borderClass}`}
      style={{ 
        zIndex: 40, 
        width: width, 
        minWidth: MIN_WIDTH, 
        maxWidth: MAX_WIDTH, 
        transition: dragging ? 'none' : 'width 0.15s', 
        position: 'relative' 
      }}
    >
      {/* Thin left drag handle */}
      <div
        style={{ 
          width: 4, // Much thinner drag handle
          height: '100%', 
          cursor: 'ew-resize', 
          background: dragging === 'left' ? accentHex : 'transparent', 
          zIndex: 41, 
          position: 'absolute', 
          left: 0, 
          top: 0,
          transition: 'background 0.15s ease'
        }}
        onMouseDown={e => onMouseDown(e, 'left')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Resize panel"
      >
        {/* Thin accent line on hover/drag */}
        {(hovered || dragging) && (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: accentHex,
              opacity: dragging ? 1 : 0.6,
              transition: 'opacity 0.15s ease'
            }}
          />
        )}
      </div>
      
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Subsidebar */}
        <nav className={`w-14 h-full flex flex-col items-center py-4 gap-2 border-r ${borderClass} bg-bg`}>
          {navItems.map(item => (
            <button
              key={item.key}
              aria-label={item.label}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150
                ${activeTab === item.key 
                  ? `bg-accent/20 text-accent` 
                  : 'text-text/60 hover:bg-bg-secondary hover:text-accent'
                }`}
              title={item.label}
              onClick={() => setActiveTab(item.key)}
              type="button"
            >
              {item.icon}
            </button>
          ))}
        </nav>
        {/* Panel content */}
        <div className="flex-1 h-full overflow-y-auto bg-bg">
          {panelContent[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default RestRightPanel; 