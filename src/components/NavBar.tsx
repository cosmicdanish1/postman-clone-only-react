// File: NavBar.tsx
// Type: Component (navigation bar)
// Imports: React, various icons, and utility functions
// Imported by: App.tsx (renders at the top of the layout)
// Role: Renders the top navigation bar for the application, including logo, search, and actions.
// Located at: src/components/NavBar.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from './ToolTip/Tooltip';
import useThemeClass from '../hooks/useThemeClass';
import { useSearch } from '../contexts/SearchContext';
import SearchModal from './SearchModal/SearchModal';
import DownloadDropdown from './DownloadDropdown/DownloadDropdown';

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const { 
    themeClass, 
    accentColorClass, 
    searchBarClass, 
    textLightClass: searchTextClass, 
    kbdClass, 
    appNameClass, 
    borderClass 
  } = useThemeClass();
  
  const { openSearch } = useSearch();
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  console.log('NavBar - showDownloadDropdown:', showDownloadDropdown);
  
  // Add keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return (
    <>
     <header className={`grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden pb-1 pt-1 bg-bg text-text ${themeClass} ${borderClass} z-[100]`}>

    
    {/* <!-- Logo Section --> */}
<div className="col-span-2 flex items-center justify-between space-x-2">
  <div className="flex">
    <a href="/" className="inline-flex items-center justify-center font-bold uppercase tracking-wide px-4 py-2 hover:bg-stone-50">
      <span className={`truncate max-w-[16rem] text-[16px] ml-3 ${appNameClass}`}>
        {t('app_name')}
      </span>
    </a>
  </div>
</div>

    
    {/* Search Bar */}
    <div className="col-span-1 flex items-center justify-between space-x-2">
      <button 
        className={`flex flex-1 items-center justify-between rounded-md px-3 py-2 w-full ${searchBarClass}`}
        onClick={openSearch}
      >
        <span className={`flex items-center font-semibold text-[14px] opacity-75 ${searchTextClass}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21l-4.3-4.3" /></g></svg>
          {t('Search and commands')}
        </span>
        <span className="flex space-x-1">
          <kbd className={`px-1 rounded text-xs ${kbdClass}`}>
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className={`px-1 rounded text-sm ${kbdClass}`}>K</kbd>
        </span>
      </button>
      <SearchModal />
    </div>



    {/* <!-- Actions Section --> */}
    <div className="flex col-span-2 items-center justify-between space-x-2  ">
      <div className="flex space-x-2 ">


        <div className="relative">
          <button 
            ref={downloadButtonRef}
            className="p-2 rounded text-neutral-400 hover:bg-gray-700"
            onClick={() => {
              console.log('Download button clicked, toggling dropdown');
              setShowDownloadDropdown(!showDownloadDropdown);
            }}
            aria-haspopup="true"
            aria-expanded={showDownloadDropdown}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3"
              />
            </svg>
          </button>
          <DownloadDropdown 
            isOpen={showDownloadDropdown} 
            onClose={() => setShowDownloadDropdown(false)}
            triggerRef={downloadButtonRef}
          />
        </div>
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
        
        <button 
          className="px-4 py-2 rounded text-sm mb-2 tracking-wide font-bold text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] transition-colors"
          style={accentColorClass.style as React.CSSProperties}
        >
          {t('login')}
        </button>
      </div>
    </div>
  </header>
    </>
  );
};

export default NavBar; 