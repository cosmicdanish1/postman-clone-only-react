// File: TabsBar.tsx
// Type: Component (main tabs bar)
// Imports: React, utility functions, and possibly drag-and-drop helpers
// Imported by: Main layout or request/response editors
// Role: Renders the main tabs bar for switching between open requests or features.
// Located at: src/components/TabsBar.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditEnvironmentModal from './EditEnvironmentModal';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getThemeStyles } from '../utils/getThemeStyles';

interface Tab {
  id: string;
  method: string;
  tabName: string;
}

interface TabsBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSwitchTab: (id: string) => void;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  canClose: boolean;
  methodColors: Record<string, string>;
  envDropdownOpen: boolean;
  setEnvDropdownOpen: (open: boolean) => void;
  showVarsPopover: boolean;
  setShowVarsPopover: (show: boolean) => void;
  eyeRef: React.RefObject<HTMLSpanElement>;
  envTab: string;
  setEnvTab: (tab: string) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ 
  tabs, 
  activeTabId, 
  onSwitchTab, 
  onAddTab, 
  onCloseTab, 
  canClose, 
  methodColors,
  envDropdownOpen,
  setEnvDropdownOpen,
  showVarsPopover,
  setShowVarsPopover,
  eyeRef,
  envTab,
  setEnvTab
}) => {
  // State for popover position
  const [popoverLeft, setPopoverLeft] = useState<number | null>(null);
  const [popoverTop, setPopoverTop] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  // State for which modal to show
  const [editModal, setEditModal] = useState<null | 'global' | 'environment'>(null);
  const envBtnRef = useRef<HTMLButtonElement>(null);
  const [envPopoverLeft, setEnvPopoverLeft] = useState<number | null>(null);
  const [envPopoverTop, setEnvPopoverTop] = useState<number | null>(null);
  const envPopoverRef = useRef<HTMLDivElement>(null);
  const [envSearch, setEnvSearch] = useState('');

  // Theming logic (must be at the top level)
  const theme = useSelector((state: any) => state.theme.theme);

  // No class for light (default)

  const { t } = useTranslation();
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


   const accentColor = useSelector((state: any) => state.theme.accentColor);
  const accentHex = accentColors.find(c => c.key === accentColor)?.color;

  // Click-away handler for popover

    const { themeClass,
        buttonBgClass } = getThemeStyles(theme);
  useEffect(() => {
    if (!showVarsPopover) return;
    function handleClick(e: MouseEvent) {
      if (
        eyeRef.current &&
        !eyeRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowVarsPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showVarsPopover, setShowVarsPopover, eyeRef]);

  // Popover positioning logic
  useLayoutEffect(() => {
    if (showVarsPopover && eyeRef.current && popoverRef.current) {
      const eyeRect = eyeRef.current.getBoundingClientRect();
      const popover = popoverRef.current;
      const popoverWidth = popover.offsetWidth;
      const viewportWidth = window.innerWidth;
      // Calculate left so popover is centered below the eye icon
      let left = eyeRect.left + eyeRect.width / 2 - popoverWidth / 2;
      // Clamp to viewport
      left = Math.max(8, Math.min(left, viewportWidth - popoverWidth - 8));
      setPopoverLeft(left);
      setPopoverTop(eyeRect.bottom + 8); // 8px gap below the icon
    }
    if (!showVarsPopover) {
      setPopoverLeft(null);
      setPopoverTop(null);
    }
  }, [showVarsPopover, eyeRef]);

  // Click-away for env popover
  useEffect(() => {
    if (!envDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        envBtnRef.current &&
        !envBtnRef.current.contains(e.target as Node) &&
        envPopoverRef.current &&
        !envPopoverRef.current.contains(e.target as Node)
      ) {
        setEnvDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [envDropdownOpen, setEnvDropdownOpen]);

  // Positioning for env popover
  useLayoutEffect(() => {
    if (envDropdownOpen && envBtnRef.current && envPopoverRef.current) {
      const btnRect = envBtnRef.current.getBoundingClientRect();
      const popover = envPopoverRef.current;
      const popoverWidth = popover.offsetWidth;
      const viewportWidth = window.innerWidth;
      let left = btnRect.left + btnRect.width / 2 - popoverWidth / 2;
      left = Math.max(8, Math.min(left, viewportWidth - popoverWidth - 8));
      setEnvPopoverLeft(left);
      setEnvPopoverTop(btnRect.bottom + 8);
    }
    if (!envDropdownOpen) {
      setEnvPopoverLeft(null);
      setEnvPopoverTop(null);
    }
  }, [envDropdownOpen]);

  return (
    <>
      {/* Edit Environment Modal (for global/environment) */}
      <EditEnvironmentModal
        open={editModal !== null}
        onClose={() => setEditModal(null)}
        modalValue={editModal === 'global' ? t('global') : t('environment')}
        setModalValue={() => {}}
        onSave={() => setEditModal(null)}
      />
      <div className={`w-full  h-10  relative text-text  ${themeClass}`}>
        <div className={`flex items-center h-full w-full ${buttonBgClass} `}>
          <div className={`flex items-center flex-1 min-w-0   `}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`group relative flex items-center h-11   px-0 cursor-pointer select-none font-bold transition-all duration-200 ${tab.id === activeTabId ? '' : 'opacity-60'} ${themeClass}`}
                onClick={() => onSwitchTab(tab.id)}
              >
                {/* Highlight active tab */}
                {tab.id === activeTabId && (
                  <div className="absolute left-0 top-0 w-full  h-[2px]" style={{zIndex: 2,  backgroundColor: accentHex }} />
                )}
                <div className="flex items-center w-48 overflow-hidden  z-10 px-6">
                  <span
                    className="font-medium text-[13px]  mr-2 whitespace-nowrap"
                    style={{ color: methodColors[tab.method] || '#737373' }}
                  >
                    {tab.method}
                  </span>
                  <span className="text-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                    {tab.tabName}
                  </span>
                </div>
                <div className="w-4 h-4 flex items-center justify-center relative">
                  <span className={`w-2 h-2 rounded-full bg-gray-400 opacity-60 z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 ${canClose ? 'group-hover:opacity-0' : ''}`}></span>
                  {canClose && (
                    <button
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white z-10 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ pointerEvents: 'auto' }}
                      onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
                      tabIndex={-1}
                      title={t('close_tab')}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <span
              className="flex items-center justify-center h-12 w-10 -mt-1 rounded-t-md text-xl cursor-pointer  transition " style={{color: accentHex  }}
              onClick={onAddTab}
            >
              +
            </span>
          </div>

          {/* Environment Selector */}
          <div className="flex items-center h-full px-4 rounded gap-2 min-w-[220px] relative">
            {/* Layers icon */}
            <button
              ref={envBtnRef}
              className="flex items-center h-full opacity-50 hover:opacity-100"
              onClick={() => setEnvDropdownOpen(!envDropdownOpen)}
              tabIndex={0}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 -2 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
                  <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
                </svg>
                <span className="text-white text-[13px] font-medium mt-[1px]">Select environment</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white ml-9 mt-1"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {/* Environment Popover */}
            <AnimatePresence>
              {envDropdownOpen && (
                <motion.div
                  ref={envPopoverRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="fixed z-50 min-w-[340px] w-[360px]"
                  style={{
                    left: envPopoverLeft !== null ? envPopoverLeft : undefined,
                    top: envPopoverTop !== null ? envPopoverTop : undefined,
                  }}
                >
                  <div className="rounded-xl shadow-2xl border border-zinc-800 bg-[#232326] p-0">
                    {/* Search */}
                    <div className="px-4 pt-4 pb-2">
                      <input
                        className="w-full bg-[#18181A] border border-zinc-800 rounded px-3 py-2 text-white text-sm mb-2 focus:outline-none"
                        placeholder="Search"
                        value={envSearch}
                        onChange={e => setEnvSearch(e.target.value)}
                      />
                    </div>
                    {/* No environment option */}
                    <div className="px-4 pb-2 flex items-center justify-between cursor-pointer hover:bg-zinc-800 rounded"
                      onClick={() => {/* set active env to none */}}
                    >
                      <span className="text-zinc-200 text-[15px]">No environment</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    {/* Tabs for Personal/Workspace */}
                    <div className="flex border-b border-zinc-800 mt-2">
                      <button
                        className={`flex-1 py-2 text-[14px] font-semibold border-b-2 transition-colors ${envTab === 'personal' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
                        onClick={() => setEnvTab('personal')}
                      >
                        Personal Environments
                      </button>
                      <button
                        className={`flex-1 py-2 text-[14px] font-semibold border-b-2 transition-colors ${envTab === 'workspace' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
                        onClick={() => setEnvTab('workspace')}
                      >
                        Workspace Environments
                      </button>
                    </div>
                    {/* Empty state */}
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 opacity-40"><rect x="8" y="8" width="40" height="40" rx="8" fill="#232326"/><path d="M28 20V36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 28H36" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span className="text-zinc-400 text-sm mt-2">Environments are empty</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Eye icon with popover */}
            <span ref={eyeRef} className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-icon lucide-eye opacity-50 ml-7 hover:opacity-100 cursor-pointer"
                onClick={() => setShowVarsPopover(!showVarsPopover)}
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {/* Popover */}
              <AnimatePresence>
                {showVarsPopover && (
                  <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="fixed z-50 min-w-[320px] w-[340px]"
                    style={{
                      left: popoverLeft !== null ? popoverLeft : undefined,
                      top: popoverTop !== null ? popoverTop : undefined,
                    }}
                  >
                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 overflow-hidden">
                      <div className="w-4 h-4 bg-[#232326] rotate-45 border-t border-l border-zinc-800"></div>
                    </div>
                    <div className="rounded-xl shadow-2xl border border-zinc-800 bg-[#232326] p-0">
                      {/* Global variables section */}
                      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                        <span className="text-zinc-200 font-semibold text-[15px]">Global variables</span>
                        <button className="p-1 text-zinc-400 hover:text-white" title="Edit global variables" onClick={() => setEditModal('global')}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
                        </button>
                      </div>
                      <div className="px-4 pb-2">
                        <div className="flex text-xs text-zinc-500 mb-1">
                          <div className="w-1/2">Name</div>
                          <div className="w-1/4">Initial value</div>
                          <div className="w-1/4">Current value</div>
                        </div>
                        <div className="text-zinc-500 text-xs py-3 text-center border border-dashed border-zinc-700 rounded">No variables</div>
                      </div>
                      {/* Environment variables section */}
                      <div className="px-4 pt-4 pb-2 flex items-center justify-between border-t border-zinc-800">
                        <span className="text-zinc-200 font-semibold text-[15px]">Environment variables</span>
                        <button className="p-1 text-zinc-400 hover:text-white" title="Edit environment variables" onClick={() => setEditModal('environment')}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><g><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg>
                        </button>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="text-zinc-500 text-xs py-3 text-center border border-dashed border-zinc-700 rounded">No active environment</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabsBar; 