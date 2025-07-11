// File: HelpMenu.tsx
// Type: Component (help menu panel)
// Imports: React, utility functions
// Imported by: Main layout or request/response editors
// Role: Renders a help menu panel with shortcuts and documentation links.
// Located at: src/components/HelpMenu.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const HelpMenu = ({ open }: { open: boolean }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  const menuItems = [
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4h9"/><rect width="18" height="18" x="3" y="8" rx="2"/></svg>
      ), label: t('documentation'), shortcut: 'D', href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="13 2 13 9 20 9"/><path d="M20 22v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7"/></svg>
      ), label: t('keyboard_shortcuts'), shortcut: 'S', href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><polyline points="17 8 12 13 7 8"/></svg>
      ), label: t('chat_with_us'), href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
      ), label: t('whats_new'), href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
      ), label: t('status'), href: '#' },
    'divider',
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 1 1-8 0"/><line x1="12" x2="12" y1="14" y2="20"/></svg>
      ), label: t('github'), href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.6 1.64.9c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 .96 6.1v.06c0 2.13 1.52 3.9 3.54 4.3-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.7 2.16 2.94 4.07 2.97A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z"/></svg>
      ), label: t('twitter'), href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
      ), label: t('invite'), href: '#' },
    { icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 9v6"/><path d="M15 9v6"/></svg>
      ), label: t('terms_privacy'), href: '#' },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.16 }}
          className={`absolute bottom-10 right-0 z-50 min-w-[240px] bg-bg border border-border rounded-xl shadow-xl py-2 px-1 text-sm text-text ${themeClass}`}
          style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
        >
          {menuItems.map((item, idx) => {
            if (typeof item === 'string') {
              // Handle divider
              return <div key={`divider-${idx}`} className="my-2 border-t border-border" />;
            }
            // Now item is an object with icon, label, href, and optional shortcut
            return (
              <a
                key={`item-${idx}`}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg/80 transition-colors group"
                tabIndex={0}
              >
                <span className="text-lg opacity-80">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="px-2 py-1 rounded bg-bg/80 border border-border text-xs font-mono text-text ml-2">
                    {item.shortcut}
                  </kbd>
                )}
              </a>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpMenu; 