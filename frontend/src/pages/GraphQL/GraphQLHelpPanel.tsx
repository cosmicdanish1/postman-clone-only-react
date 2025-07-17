// File: GraphQLHelpPanel.tsx
// Type: Component (help panel for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Displays keyboard shortcuts and documentation links for GraphQL users.
// Located at: src/pages/GraphQL/GraphQLHelpPanel.tsx
import React from 'react';
import { useSelector } from 'react-redux';

const GraphQLHelpPanel: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  return (
    <div className={`w-1/3 flex flex-col items-center justify-center p-8 bg-bg text-text ${themeClass}`}>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Send Request</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs">↵</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Keyboard shortcuts</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs">/</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Search & command menu</span>
          <span className="bg-bg px-2 py-1 rounded text-xs border border-border">Ctrl</span>
          <span className="bg-bg px-2 py-1 rounded text-xs">K</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Help menu</span>
          <span className="bg-bg px-2 py-1 rounded text-xs">?</span>
        </div>
        <a
          href="#"
          className="mt-4 bg-bg hover:bg-bg/80 text-text px-4 py-2 rounded font-semibold text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation <span className="inline-block align-middle ml-1"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14m-7 7h7v-7" /></svg></span>
        </a>
      </div>
    </div>
  );
};

export default GraphQLHelpPanel; 