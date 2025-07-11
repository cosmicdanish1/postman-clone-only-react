import React from 'react';
import { useSelector } from 'react-redux';

const RestBottomActions: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const textClass =
    theme === 'light'
      ? 'text-black hover:text-gray-700'
      : 'text-white hover:text-gray-300';

  return (
    <div className="w-full flex flex-col items-center justify-center pb-4">
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-row flex-wrap gap-6 items-center justify-center w-full max-w-2xl py-4">
          <div className={`flex items-center gap-2 text-sm ${textClass}`}>
            <span>Send Request</span>
            <kbd className={`px-2 py-1 rounded text-xs ${textClass}`}>Ctrl</kbd>
            <kbd className={`px-2 py-1 rounded text-xs ${textClass}`}>↵</kbd>
          </div>
          <div className={`flex items-center gap-2 text-sm ${textClass}`}>
            <span>Keyboard shortcuts</span>
            <kbd className={`px-2 py-1 rounded text-xs ${textClass}`}>Ctrl</kbd>
            <kbd className={`px-2 py-1 rounded bg-zinc-800 text-xs ${textClass}`}>/</kbd>
          </div>
          <div className={`flex items-center gap-2 text-sm ${textClass}`}>
            <span>Search & command menu</span>
            <kbd className={`px-2 py-1 rounded bg-zinc-800 text-xs ${textClass}`}>Ctrl</kbd>
            <kbd className={`px-2 py-1 rounded bg-zinc-800 text-xs ${textClass}`}>K</kbd>
          </div>
          <div className={`flex items-center gap-2 text-sm ${textClass}`}>
            <span>Help menu</span>
            <kbd className={`px-2 py-1 rounded bg-zinc-800 text-xs ${textClass}`}>?</kbd>
          </div>
          <div className={`flex items-center gap-2 text-sm ${textClass}`}>
            <span>Documentation</span>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0 0L10 21l-7-7 11-11z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestBottomActions; 