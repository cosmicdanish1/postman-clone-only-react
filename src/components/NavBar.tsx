// File: NavBar.tsx
// Type: Component (navigation bar)
// Imports: React, various icons, and utility functions
// Imported by: App.tsx (renders at the top of the layout)
// Role: Renders the top navigation bar for the application, including logo, search, and actions.
// Located at: src/components/NavBar.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const NavBar: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)


  return (
    <>
      <header className={`grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden pb- pt-1 bg-bg text-text ${themeClass} z-[50]`} style={{ zIndex: 50 }}>
    
    {/* <!-- Logo Section --> */}
    <div className="col-span-2 flex items-center justify-between space-x-2">
      <div className="flex">
        <a href="/" className="inline-flex items-center justify-center font-bold uppercase tracking-wide px-4 py-2 text-white hover:bg-[#262626]">
          <span className="truncate max-w-[16rem] text-xs ml-3">{t('app_name')}</span>
        </a>
      </div>
    </div>
    
    {/* <!-- Search Bar --> */}
    <div className="col-span-1 flex items-center justify-between space-x-2 ">
      <button className="flex flex-1 items-center justify-between  rounded-md bg-neutral-800 px-2 py-1 hover:bg-neutral-900  w-full">
        <span className="flex items-center font-semibold text-gray-400 text-xs hover:text-gray-100">
          <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2 text-gray-500 text-sm hover:text-gray-100 "><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21l-4.3-4.3"></path></g></svg>
          {t('search_and_commands')}
        </span>
        <span className="flex space-x-1">
          <kbd className="bg-[#1f1f1f] px-1 rounded text-gray-400 text-sm border border-white/10">Ctrl</kbd><kbd className="bg-[#1f1f1f] px-1 rounded text-gray-400 text-sm border border-white/10">K</kbd>
        </span>
      </button>
    </div>

    {/* <!-- Actions Section --> */}
    <div className="flex col-span-2 items-center justify-between space-x-2  ">
      <div className="flex space-x-2 ">
        <button className="p-2 rounded text-neutral-400 hover:bg-gray-700">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3"></path></svg>
        </button>
        <button className="p-2 rounded text-neutral-400 hover:bg-gray-700">
          <svg viewBox="0 0 24 24" width="20" height="20"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93l4.24 4.24m5.66 0l4.24-4.24m-4.24 9.9l4.24 4.24m-9.9-4.24l-4.24 4.24"></path><circle cx="12" cy="12" r="4"></circle></g></svg>
        </button>
      </div>
      
      {/* <!-- Save and Login Buttons --> */}
      <div className="inline-flex items-center space-x-2">
        <button className="hidden md:flex items-center px-4 py-2 mb-2 border border-emerald-600/25 bg-emerald-500/10 text-emerald-500 text-sm hover:bg-emerald-600/20 hover:border-emerald-600/20 rounded">
          <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 13v8m-8-6.101A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17l4-4l4 4"></path></g></svg>
          {t('save_workspace')}
        </button>
        <button className="px-4 py-2 rounded bg-[#2563EB] text-sm mb-2 tracking-wide font-bold hover:bg-blue-700 text-white">
          {t('login')}
        </button>
      </div>
    </div>
  </header>
    </>
  );
};

export default NavBar; 