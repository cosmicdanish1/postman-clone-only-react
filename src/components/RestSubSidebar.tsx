import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFolder, FaGlobe, FaHistory, FaShareAlt, FaRegFileAlt, FaCode } from 'react-icons/fa';

const RestSubSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="w-11 border-gray-500 border border-opacity-30 bg-zinc-900 flex flex-col py-5 gap-6 items-center shadow-inner h-full">
      <Link to="/collections" className={`flex items-center justify-center group ${location.pathname === '/collections' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      </Link>
      <Link to="/environments" className={`flex items-center justify-center group ${location.pathname === '/environments' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers-icon lucide-layers">
          <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
          <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
          <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
        </svg>
      </Link>
      <Link to="/history" className={`flex items-center justify-center group ${location.pathname === '/history' ? 'text-violet-400' : 'text-zinc-300'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock-icon lucide-clock">
         <path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>
         </svg>
      </Link>
      <Link to="/share" className={`flex items-center justify-center group ${location.pathname === '/share' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2-icon lucide-share-2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      </Link>
      <Link to="/generate-code" className={`flex items-center justify-center group ${location.pathname === '/generate-code' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-icon lucide-code">
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      </Link>
    </nav>
  );
};

export default RestSubSidebar; 