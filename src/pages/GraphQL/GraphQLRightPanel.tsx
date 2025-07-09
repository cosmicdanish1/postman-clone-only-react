import React, { useState } from 'react';

const icons = [
  // Book (active)
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  ),
  // Cube
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  // Folder
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 3h6a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // Clock
  (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
];

const panelContents = [
  <div className="text-gray-400 text-center mt-8">GraphQL Schema Panel</div>,
  <div className="text-gray-400 text-center mt-8">GraphQL Explorer Panel</div>,
  <div className="text-gray-400 text-center mt-8">GraphQL Collections Panel</div>,
  <div className="text-gray-400 text-center mt-8">GraphQL History Panel</div>,
];

const GraphQLRightPanel: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <div className="flex flex-row h-full w-full bg-neutral-900 border-l border-neutral-800">
      {/* Sub sidebar */}
      <div className="flex flex-col items-center py-4 px-0 gap-6 bg-[#18181a] border-r border-neutral-800 h-full w-14">
        {icons.map((icon, idx) => (
          <button
            key={idx}
            className={`flex items-center justify-center w-10 h-10 rounded-lg mb-1 ${activeIdx === idx ? 'bg-[#18181a] text-blue-500' : 'text-gray-400 hover:text-blue-400'} cursor-pointer`}
            onClick={() => setActiveIdx(idx)}
            aria-label={`Panel ${idx + 1}`}
            type="button"
          >
            {icon}
          </button>
        ))}
      </div>
      {/* Main right panel content area, changes with activeIdx */}
      <div className="flex-1 p-4 overflow-y-auto">
        {panelContents[activeIdx]}
      </div>
    </div>
  );
};

export default GraphQLRightPanel; 