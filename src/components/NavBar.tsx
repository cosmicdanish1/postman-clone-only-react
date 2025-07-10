// File: NavBar.tsx
// Type: Component (navigation bar)
// Imports: React, various icons, and utility functions
// Imported by: App.tsx (renders at the top of the layout)
// Role: Renders the top navigation bar for the application, including logo, search, and actions.
// Located at: src/components/NavBar.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Tooltip from './ToolTip/Tooltip';

const NavBar: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  const accentColor = useSelector((state: any) => state.theme.accentColor);

  const accentColors = [
    { key: 'green', color: '#22c55e' },
    { key: 'blue', color: '#2563eb' },
    { key: 'cyan', color: '#06b6d4' },
    { key: 'purple', color: '#7c3aed' },
    { key: 'yellow', color: '#eab308' },
    { key: 'orange', color: '#f59e42' },
    { key: 'red', color: '#ef4444' },
    { key: 'pink', color: '#ec4899' },
  ];


  const accentHex = accentColors.find(c => c.key === accentColor)?.color;

  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';

  // No class for light (default)

let searchBarClass = 'bg-neutral-800 hover:bg-neutral-900';
let searchTextClass = 'text-gray-500 hover:text-gray-100';
let kbdClass = 'bg-[#1f1f1f] text-gray-400 border border-white/10';

if (theme === 'black') {
  searchBarClass = 'bg-black hover:bg-zinc-900';
} else if (theme === 'light') {
  searchBarClass = 'bg-white border border-gray-200 hover:bg-gray-100';
  searchTextClass = 'text-gray-700 hover:text-black';
  kbdClass = 'bg-gray-200 text-gray-800 border border-gray-300';
}

let appNameClass = 'text-white'; // default
if (theme === 'light') {
  appNameClass = 'text-black';
}



let borderClass = 'border-b border-neutral-700'; // Default for dark
if (theme === 'black') {
  borderClass = 'border-b border-neutral-800 ';
} else if (theme === 'light') {
  borderClass = 'border-b border-gray-200';
}




  return (
    <>
     <header className={`grid grid-cols-5 grid-rows-1  gap-2 overflow-x-auto overflow-y-hidden pb-1 pt-1 bg-bg text-text ${themeClass} ${borderClass} z-[50]`} style={{ zIndex: 50 }}>

    
    {/* <!-- Logo Section --> */}
<div className="col-span-2 flex items-center justify-between space-x-2">
  <div className="flex">
    <a href="/" className="inline-flex items-center justify-center font-bold uppercase tracking-wide px-4 py-2 hover:bg-[#262626]">
      <span className={`truncate max-w-[16rem] text-[16px] ml-3 ${appNameClass}`}>
        {t('app_name')}
      </span>
    </a>
  </div>
</div>

    
    {/* <!-- Search Bar --> */}
<div className={`col-span-1 flex items-center justify-between space-x-2 bg-bg text-text ${themeClass}`}>
  <button className={`flex flex-1 items-center justify-between rounded-md px-3 py-2 w-full ${searchBarClass}`}>
    <span className={`flex items-center font-semibold text-[14px] opacity-75 ${searchTextClass}`}>
      <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21l-4.3-4.3" /></g></svg>
      {t('search_and_commands')}
    </span>
    <span className="flex space-x-1">
      <kbd className={`px-1 rounded text-xs ${kbdClass}`}>Ctrl</kbd>
      <kbd className={`px-1 rounded text-sm ${kbdClass}`}>K</kbd>
    </span>
  </button>
</div>



    {/* <!-- Actions Section --> */}
    <div className="flex col-span-2 items-center justify-between space-x-2  ">
      <div className="flex space-x-2 ">


        <button className="p-2 rounded text-neutral-400 hover:bg-gray-700">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3"></path></svg>
        </button>
        <Tooltip content='Support' position='left'>
        <button className="p-2 rounded text-neutral-400 hover:bg-gray-700">
          <svg viewBox="0 0 24 24" width="20" height="20"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93l4.24 4.24m5.66 0l4.24-4.24m-4.24 9.9l4.24 4.24m-9.9-4.24l-4.24 4.24"></path><circle cx="12" cy="12" r="4"></circle></g></svg>
        </button>
        </Tooltip>
      </div>
      
      {/* <!-- Save and Login Buttons --> */}
      <div className="inline-flex items-center space-x-2 ">
        
        <button className="hidden md:flex items-center px-4 py-2 mb-2 border border-emerald-600/25 bg-emerald-500/10 text-emerald-500 text-sm hover:bg-emerald-600/20 hover:border-emerald-600/20 rounded">
          <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 13v8m-8-6.101A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17l4-4l4 4"></path></g></svg>
          {t('save_workspace')}
        </button>
        
        <button className="px-4 py-2 rounded  text-sm mb-2   tracking-wide font-bold hover:bg-blue-700 text-white" style={{ backgroundColor: accentHex }}>
          {t('login')}
        </button>
      </div>
    </div>
  </header>
    </>
  );
};

export default NavBar; 