// File: ShortcutsPanel.tsx
// Type: Component (shortcuts panel)
// Imports: React, utility functions
// Imported by: Main layout or request/response editors
// Role: Renders a panel displaying keyboard shortcuts for the app.
// Located at: src/components/ShortcutsPanel.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const shortcuts = [
  {
    section: 'general',
    items: [
      { label: 'help_menu', keys: ['?'] },
      { label: 'search_command_menu', keys: ['Ctrl', 'K'] },
      { label: 'keyboard_shortcuts', keys: ['Ctrl', '/'] },
      { label: 'close_current_menu', keys: ['ESC'] },
    ],
  },
  {
    section: 'request',
    items: [
      { label: 'send_request', keys: ['Ctrl', '↵'] },
      { label: 'save_to_collections', keys: ['Ctrl', 'S'] },
      { label: 'share_request', keys: ['Ctrl', 'U'] },
      { label: 'reset_request', keys: ['Ctrl', 'I'] },
      { label: 'select_next_method', keys: ['Alt', '↑'] },
      { label: 'select_prev_method', keys: ['Alt', '↓'] },
      { label: 'select_get_method', keys: ['Alt', 'G'] },
      { label: 'select_head_method', keys: ['Alt', 'H'] },
      { label: 'select_post_method', keys: ['Alt', 'P'] },
      { label: 'select_put_method', keys: ['Alt', 'U'] },
      { label: 'select_delete_method', keys: ['Alt', 'X'] },
    ],
  },
  {
    section: 'response',
    items: [
      { label: 'download_response', keys: ['Ctrl', 'J'] },
      { label: 'copy_response', keys: ['Ctrl', '.'] },
    ],
  },
  {
    section: 'navigation',
    items: [
      { label: 'go_back', keys: ['Ctrl', '←'] },
      { label: 'go_forward', keys: ['Ctrl', '→'] },
      { label: 'go_rest', keys: ['Alt', 'R'] },
      { label: 'go_graphql', keys: ['Alt', 'Q'] },
      { label: 'go_realtime', keys: ['Alt', 'W'] },
      { label: 'go_settings', keys: ['Alt', 'S'] },
      { label: 'go_profile', keys: ['Alt', 'M'] },
    ],
  },
  {
    section: 'miscellaneous',
    items: [
      { label: 'invite_people', keys: ['Ctrl', 'M'] },
    ],
  },
];

const ShortcutsPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [search, setSearch] = useState('');
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

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
          className={`fixed inset-0 bg-black bg-opacity-40 z-50 ${themeClass}`}
          onClick={onClose}
          aria-label={t('close_shortcuts_panel_overlay')}
        />
      )}
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: open ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28 }}
        className={`fixed top-0 right-0 h-full w-[380px] max-w-full bg-bg border-l border-border shadow-2xl z-50 flex flex-col text-text ${themeClass}`}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <span className="text-2xl font-bold text-white">{t('shortcuts')}</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl font-bold focus:outline-none"
            aria-label={t('close_shortcuts_panel')}
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4 border-b border-zinc-800">
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded bg-neutral-800 text-zinc-200 text-sm focus:outline-none border border-zinc-700"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar-dark">
          {filteredShortcuts.length === 0 ? (
            <div className="text-zinc-400 text-center mt-10">{t('no_shortcuts_found')}</div>
          ) : (
            filteredShortcuts.map(section => (
              <div key={section.section}>
                <div className="text-zinc-400 text-xs font-semibold uppercase mb-2 tracking-wide">{t(section.section)}</div>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <div key={item.label} className="flex items-center justify-between text-zinc-200 text-sm">
                      <span>{t(item.label)}</span>
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