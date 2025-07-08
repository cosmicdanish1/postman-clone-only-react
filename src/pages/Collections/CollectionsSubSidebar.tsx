// File: CollectionsSubSidebar.tsx
// Type: Component (sidebar for collections)
// Imports: React
// Imported by: Layout.tsx (conditionally for /collections route)
// Role: Renders the sidebar navigation for the Collections feature.
// Located at: src/pages/Collections/CollectionsSubSidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFolder, FaGlobe, FaHistory, FaShareAlt, FaRegFileAlt, FaCode } from 'react-icons/fa';

const CollectionsSubSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="w-14 bg-zinc-900 flex flex-col py-5 gap-8 items-center shadow-inner h-full">
      <Link to="/collections" className={`flex items-center justify-center group ${location.pathname === '/collections' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      </Link>
      <Link to="/history" className={`flex items-center justify-center group ${location.pathname === '/history' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history-icon lucide-history">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      </Link>
      <Link to="/generate-code" className={`flex items-center justify-center group ${location.pathname === '/generate-code' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-icon lucide-code">
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      </Link>
    </nav>
  );
};

export default CollectionsSubSidebar; 