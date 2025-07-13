import React, { useState } from 'react';
import useThemeClass from '../../../hooks/useThemeClass';
import Collections from './Collections';
import History from './History';
import GenerateCode from './GenerateCode';

const navItems = [
  {
    key: 'collections',
    icon: (
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>
    ),
    label: 'Collections',
  },
  {
    key: 'history',
    icon: (
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83ZM22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65m20-5l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path></svg>
    ),
    label: 'History',
  },
  {
    key: 'generate-code',
    icon: (
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></g></svg>
    ),
    label: 'Generate Code',
  },
  {
    key: 'connections',
    icon: (
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98"></path></g></svg>
    ),
    label: 'Connections',
  },
  {
    key: 'code-arrows',
    icon: (
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 18l6-6l-6-6M8 6l-6 6l6 6"></path></svg>
    ),
    label: 'Code Arrows',
  },
];

const panelContent = {
  collections: <Collections />,
  history: <History />,
  'generate-code': <GenerateCode />,
  connections: <div className="p-4 text-gray-400">Connections panel placeholder</div>,
  'code-arrows': <div className="p-4 text-gray-400">Code Arrows panel placeholder</div>,
};
type PanelTab = keyof typeof panelContent;

const RestRightPanel: React.FC = () => {
  // Use theme class hook for consistent theming
  const { themeClass, borderClass } = useThemeClass();
  
  const [activeTab, setActiveTab] = useState<PanelTab>('collections');

  return (
    <div
      className={`h-full w-full bg-bg text-text shadow-inner z-30 ${themeClass} ${borderClass}`}
      style={{ 
        zIndex: 40,
        position: 'relative',
        display: 'flex',
        height: '100%',
        minWidth: '300px' // Ensure minimum width
      }}
    >
        {/* Subsidebar */}
        <nav className={`w-14 h-full flex flex-col items-center py-4 gap-2 border-r ${borderClass} bg-bg`}>
          {navItems.map(item => (
            <button
              key={item.key}
              aria-label={item.label}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150
                ${activeTab === item.key 
                  ? 'text-accent font-semibold' 
                  : 'text-text/60 hover:bg-bg-secondary hover:text-accent'
                }`}
              title={item.label}
              onClick={() => setActiveTab(item.key as PanelTab)}
              type="button"
            >
              <span className={activeTab === item.key ? 'text-accent' : ''}>
                {item.icon}
              </span>
            </button>
          ))}
        </nav>
        {/* Panel content */}
        <div className="flex-1 h-full overflow-y-auto bg-bg" style={{ minWidth: 0 }}>
          <div className="w-full h-full">
            {panelContent[activeTab]}
          </div>
        </div>
    </div>
  );
};

export default RestRightPanel; 