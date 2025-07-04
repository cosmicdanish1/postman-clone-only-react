import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaSitemap, FaFolder, FaHistory } from 'react-icons/fa';

const GraphQLSubSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="w-11 bg-zinc-900 flex flex-col py-1 mt-3.5 gap-5 items-center shadow-inner h-full">
      <Link to="/graphql/docs" className={`flex items-center justify-center group ${location.pathname === '/graphql/docs' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-icon lucide-book-open">
          <path d="M12 7v14" />
           <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
      </Link>
      <Link to="/graphql/schema" className={`flex items-center justify-center group ${location.pathname === '/graphql/schema' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box-icon lucide-box">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </Link>
      <Link to="/graphql/collections" className={`flex items-center justify-center group ${location.pathname === '/graphql/collections' ? 'text-violet-400' : 'text-zinc-300'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-icon lucide-folder">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      </Link>
      <Link to="/graphql/history" className={`flex items-center justify-center group ${location.pathname === '/graphql/history' ? 'text-violet-400' : 'text-zinc-300'}`}>
         <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock-icon lucide-clock">
         <path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>
         </svg>
      </Link>
    </nav>
  );
};

export default GraphQLSubSidebar; 