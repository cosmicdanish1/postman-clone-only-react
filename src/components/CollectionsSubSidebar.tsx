import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFolder, FaGlobe, FaHistory, FaShareAlt, FaRegFileAlt, FaCode } from 'react-icons/fa';

const CollectionsSubSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="w-14 bg-zinc-900 flex flex-col py-5 gap-8 items-center shadow-inner h-full">
      <Link to="/collections" className={`flex items-center justify-center group ${location.pathname === '/collections' ? 'text-violet-400' : 'text-zinc-300'}`}><FaFolder size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/environments" className={`flex items-center justify-center group ${location.pathname === '/environments' ? 'text-violet-400' : 'text-zinc-300'}`}><FaGlobe size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/history" className={`flex items-center justify-center group ${location.pathname === '/history' ? 'text-violet-400' : 'text-zinc-300'}`}><FaHistory size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/share" className={`flex items-center justify-center group ${location.pathname === '/share' ? 'text-violet-400' : 'text-zinc-300'}`}><FaShareAlt size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/request" className={`flex items-center justify-center group ${location.pathname === '/request' ? 'text-violet-400' : 'text-zinc-300'}`}><FaRegFileAlt size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/generate-code" className={`flex items-center justify-center group ${location.pathname === '/generate-code' ? 'text-violet-400' : 'text-zinc-300'}`}><FaCode size={20} className="group-hover:text-violet-400" /></Link>
    </nav>
  );
};

export default CollectionsSubSidebar; 