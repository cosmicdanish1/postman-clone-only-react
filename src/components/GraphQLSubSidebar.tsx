import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaSitemap, FaFolder, FaHistory } from 'react-icons/fa';

const GraphQLSubSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="w-14 bg-zinc-900 flex flex-col py-5 gap-8 items-center shadow-inner h-full">
      <Link to="/graphql/docs" className={`flex items-center justify-center group ${location.pathname === '/graphql/docs' ? 'text-violet-400' : 'text-zinc-300'}`}><FaBook size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/graphql/schema" className={`flex items-center justify-center group ${location.pathname === '/graphql/schema' ? 'text-violet-400' : 'text-zinc-300'}`}><FaSitemap size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/graphql/collections" className={`flex items-center justify-center group ${location.pathname === '/graphql/collections' ? 'text-violet-400' : 'text-zinc-300'}`}><FaFolder size={20} className="group-hover:text-violet-400" /></Link>
      <Link to="/graphql/history" className={`flex items-center justify-center group ${location.pathname === '/graphql/history' ? 'text-violet-400' : 'text-zinc-300'}`}><FaHistory size={20} className="group-hover:text-violet-400" /></Link>
    </nav>
  );
};

export default GraphQLSubSidebar; 