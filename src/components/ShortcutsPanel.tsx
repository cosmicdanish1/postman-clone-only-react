import React, { useState } from 'react';
import { motion } from 'framer-motion';

const shortcuts = [
  {
    section: 'General',
    items: [
      { label: 'Help menu', keys: ['?'] },
      { label: 'Search & command menu', keys: ['Ctrl', 'K'] },
      { label: 'Keyboard shortcuts', keys: ['Ctrl', '/'] },
      { label: 'Close current menu', keys: ['ESC'] },
    ],
  },
  {
    section: 'Request',
    items: [
      { label: 'Send Request', keys: ['Ctrl', '↵'] },
      { label: 'Save to Collections', keys: ['Ctrl', 'S'] },
      { label: 'Share Request', keys: ['Ctrl', 'U'] },
      { label: 'Reset Request', keys: ['Ctrl', 'I'] },
      { label: 'Select Next method', keys: ['Alt', '↑'] },
      { label: 'Select Previous method', keys: ['Alt', '↓'] },
      { label: 'Select GET method', keys: ['Alt', 'G'] },
      { label: 'Select HEAD method', keys: ['Alt', 'H'] },
      { label: 'Select POST method', keys: ['Alt', 'P'] },
      { label: 'Select PUT method', keys: ['Alt', 'U'] },
      { label: 'Select DELETE method', keys: ['Alt', 'X'] },
    ],
  },
  {
    section: 'Response',
    items: [
      { label: 'Download response as file', keys: ['Ctrl', 'J'] },
      { label: 'Copy response to clipboard', keys: ['Ctrl', '.'] },
    ],
  },
  {
    section: 'Navigation',
    items: [
      { label: 'Go back to previous page', keys: ['Ctrl', '←'] },
      { label: 'Go forward to next page', keys: ['Ctrl', '→'] },
      { label: 'Go to REST page', keys: ['Alt', 'R'] },
      { label: 'Go to GraphQL page', keys: ['Alt', 'Q'] },
      { label: 'Go to Realtime page', keys: ['Alt', 'W'] },
      { label: 'Go to Settings page', keys: ['Alt', 'S'] },
      { label: 'Go to Profile page', keys: ['Alt', 'M'] },
    ],
  },
  {
    section: 'Miscellaneous',
    items: [
      { label: 'Invite people to Hoppscotch', keys: ['Ctrl', 'M'] },
    ],
  },
];

const ShortcutsPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [search, setSearch] = useState('');

  // Filter shortcuts by search
  const filteredShortcuts = shortcuts
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.keys.join(' ').toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(section => section.items.length > 0);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-50"
          onClick={onClose}
          aria-label="Close shortcuts panel overlay"
        />
      )}
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: open ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28 }}
        className={`fixed top-0 right-0 h-full w-[380px] max-w-full bg-neutral-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col`}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <span className="text-2xl font-bold text-white">Shortcuts</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl font-bold focus:outline-none"
            aria-label="Close shortcuts panel"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4 border-b border-zinc-800">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded bg-neutral-800 text-zinc-200 text-sm focus:outline-none border border-zinc-700"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar-dark">
          {filteredShortcuts.length === 0 ? (
            <div className="text-zinc-400 text-center mt-10">No shortcuts found.</div>
          ) : (
            filteredShortcuts.map(section => (
              <div key={section.section}>
                <div className="text-zinc-400 text-xs font-semibold uppercase mb-2 tracking-wide">{section.section}</div>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <div key={item.label} className="flex items-center justify-between text-zinc-200 text-sm">
                      <span>{item.label}</span>
                      <span className="flex gap-1">
                        {item.keys.map((key, i) => (
                          <kbd key={i} className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
                            {key}
                          </kbd>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <style>{`
          .custom-scrollbar-dark::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-thumb {
            background: #23272e;
            border-radius: 4px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-track {
            background: #18181b;
          }
          .custom-scrollbar-dark {
            scrollbar-color: #23272e #18181b;
            scrollbar-width: thin;
          }
        `}</style>
      </motion.div>
    </>
  );
};

export default ShortcutsPanel; 