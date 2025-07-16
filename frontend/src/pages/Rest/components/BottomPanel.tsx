import React, { useState } from 'react';
import useThemeClass from '../../../hooks/useThemeClass';

const bottomPanelTabs = [
  { key: 'console', label: 'Console' },
  { key: 'test-results', label: 'Test Results' },
];

type BottomPanelTab = (typeof bottomPanelTabs)[number]['key'];

const BottomPanel: React.FC = () => {
  const { themeClass, borderClass } = useThemeClass();
  const [activeTab, setActiveTab] = useState<BottomPanelTab>('console');

  return (
    <div className={`h-full w-full bg-bg text-text shadow-inner z-30 ${themeClass} ${borderClass}`} style={{ position: 'relative', minHeight: '100px' }}>
      {/* Tabs header */}
      <nav className={`flex items-center h-10 border-b ${borderClass} bg-bg px-4 gap-2`}>
        {bottomPanelTabs.map(tab => (
          <button
            key={tab.key}
            aria-label={tab.label}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${activeTab === tab.key ? 'text-accent font-semibold' : 'text-gray-400 hover:text-foreground'}`}
            onClick={() => setActiveTab(tab.key as BottomPanelTab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Content */}
      <div className="flex-1 overflow-auto p-4 text-gray-400">
        {activeTab === 'console' && <div>Console output will appear here.</div>}
        {activeTab === 'test-results' && <div>Test results will appear here.</div>}
      </div>
    </div>
  );
};

export default BottomPanel;
