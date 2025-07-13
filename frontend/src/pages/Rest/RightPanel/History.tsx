import React from 'react';
import { useSelector } from 'react-redux';

const ICON_SIZE = 20;

const ICONS = {
  help: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 13a2 2 0 1 0-2-2m2 2v2m0-10a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/></svg>
  ),
  filter: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-4.586a1 1 0 0 0-.293-.707L2.293 6.707A1 1 0 0 1 2 6V4Z"/></svg>
  ),
  delete: (
    <svg width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12Z"/></svg>
  ),
};

const THEME_SVGS = {
  light: '/images/states/light/time.svg',
  dark: '/images/states/dark/time.svg',
  black: '/images/states/black/time.svg',
};

const History: React.FC = () => {
  const theme = useSelector((state: { theme: { theme: keyof typeof THEME_SVGS } }) => state.theme.theme);
  const svgSrc = (THEME_SVGS as Record<string, string>)[theme] ?? THEME_SVGS.light;
  const textClass = theme === 'light' ? 'text-black' : 'text-white';
  const subTextClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm font-medium ${textClass}`}> 
          <span>Personal Workspace</span>
          <span className="text-gray-400">/</span>
          <span className={textClass}>History</span>
        </div>
        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="hover:text-blue-500" title="Help">{ICONS.help}</button>
          <button className="hover:text-blue-500" title="Filter">{ICONS.filter}</button>
          <button className="hover:text-red-500" title="Delete All">{ICONS.delete}</button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history"
            className="w-full px-3 py-2 pl-8 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <img src={svgSrc} alt="Empty history" className="w-40 h-40 mb-6 select-none pointer-events-none" draggable={false} />
        <div className={`text-lg font-semibold mb-2 ${textClass}`}>History is empty</div>
        <div className={`text-sm ${subTextClass}`}>You haven’t made any requests yet.</div>
      </div>
    </div>
  );
};

export default History; 