// File: BottomBar.tsx
// Type: Component (UI footer bar)
// Imports: React, various icons, utility functions, and other components
// Imported by: App.tsx (renders at the bottom of the layout)
// Role: Renders the bottom bar/footer for the application, including status, links, and actions.
// Located at: src/components/BottomBar.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { toggleExpandNav } from '../features/settingsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import ShortcutsPanel from './ShortcutsPanel';
import HelpMenu from './HelpMenu';
import { useTranslation } from 'react-i18next';

/**
 * BottomBar – a slim footer bar that stays pinned to the bottom of the viewport.
 * Currently shows a couple of placeholder icons on the left and a "Help & feedback"
 * button on the right. Adjust the content as needed.
 */
const BottomBar: React.FC = () => {
  const dispatch = useDispatch();
  const expandNav = useSelector((state: RootState) => state.settings.expandNav);
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
  const [showInterceptor, setShowInterceptor] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [verticalRotating, setVerticalRotating] = useState(false);
  const [panelAnimating, setPanelAnimating] = useState(false);
  const [shortcutsRotating, setShortcutsRotating] = useState(false);
  const [shortcutsPanelOpen, setShortcutsPanelOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpRef = useRef<HTMLAnchorElement>(null);
  const { t } = useTranslation();

  // Close popup on outside click
  useEffect(() => {
    if (!showInterceptor) return;
    function handleClick(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setShowInterceptor(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showInterceptor]);

  // Close HelpMenu on outside click
  useEffect(() => {
    if (!helpMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        helpRef.current &&
        !helpRef.current.contains(e.target as Node)
      ) {
        setHelpMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [helpMenuOpen]);




   let borderClass = 'border-t border-neutral-700'; // default for dark
if (theme === 'black') {
  borderClass = 'border-t border-neutral-800';
} else if (theme === 'light') {
  borderClass = 'border-t border-gray-200';
}
  // Positioning: popup appears just above the icon, always fully visible
  return (
    <footer className={`fixed bottom-0 left-0 right-0 h-8 bg-bg  text-text flex items-center justify-between px-3 select-none z-[50] ${themeClass} ${borderClass}`} style={{ zIndex: 50 }}>
    {/* Left side icons */}
      <div className="flex items-center space-x-4 text-gray-400 relative">
        <button 
          className="hover:text-gray-100" 
          title={expandNav ? t('collapse_sidebar') : t('expand_sidebar')}
          onClick={() => dispatch(toggleExpandNav())}
        >
          {/* simple vertical bar icon with rotation */}
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${expandNav ? 'rotate-180' : 'rotate-0'}`}
          >
            <path d="M3 3h18v18H3z"></path>
            <path d="M9 3v18"></path>
          </svg>
      </button>
        <button
          ref={iconRef}
          className="hover:text-gray-100 relative"
          title={t('status_ok')}
          onClick={() => setShowInterceptor((v) => !v)}
        >
          {/* shield check icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check-icon lucide-shield-check">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          {/* Popup InterceptorCard with animation */}
          <AnimatePresence>
            {showInterceptor && (
              <motion.div
                ref={popupRef}
                className="absolute bottom-10 left-0 z-50 mb-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.18 }}
              >
                {/* InterceptorCard content */}
              </motion.div>
            )}
          </AnimatePresence>
      </button>
    </div>

    {/* Right side help link */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <a
            href="#"
            ref={helpRef}
            className="flex items-center gap-2 text-xs hover:text-white"
            onClick={e => {
              e.preventDefault();
              setHelpMenuOpen(v => !v);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
            {t('help_feedback')}
          </a>
          <HelpMenu open={helpMenuOpen} onClose={() => setHelpMenuOpen(false)} anchorRef={helpRef} />
        </div>
        <button
          title={t('shortcuts')}
          className="hover:text-yellow-400 transition-colors"
          onClick={() => {
            setShortcutsRotating(true);
            setShortcutsPanelOpen(true);
          }}
        >
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
            className={`lucide lucide-zap-icon lucide-zap transition-transform duration-300 ${shortcutsRotating ? 'rotate-180' : ''}`}
            onTransitionEnd={() => setShortcutsRotating(false)}
          >
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
          </svg>
        </button>
        <button title={t('share')} className="hover:text-blue-400 transition-colors"
          onClick={() => {
            const shareData = {
              title: document.title,
              url: window.location.href,
            };
            if (navigator.share) {
              navigator.share(shareData);
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert(t('link_copied'));
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2-icon lucide-share-2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
        </button>
        <button title={t('vertical_layout')} className="hover:text-green-400 transition-colors"
          onClick={() => {
            setVerticalRotating(true);
            // You can add your layout toggle logic here if needed
          }}
        >
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
            className={`lucide lucide-rows2-icon lucide-rows-2 transition-transform duration-300 ${verticalRotating ? 'rotate-180' : ''}`}
            onAnimationEnd={() => setVerticalRotating(false)}
            onTransitionEnd={() => setVerticalRotating(false)}
          >
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M3 12h18"/>
          </svg>
        </button>
        <button
          title={t('open_right_panel')}
          className="hover:text-cyan-400 transition-colors"
          onClick={() => {
            setPanelAnimating(true);
            // Add your panel open logic here if needed
          }}
        >
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
            className={`lucide lucide-panel-right-open-icon lucide-panel-right-open transition-transform duration-300 ${panelAnimating ? 'rotate-180' : ''}`}
            onTransitionEnd={() => setPanelAnimating(false)}
          >
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M15 3v18"/>
            <path d="m10 15-3-3 3-3"/>
          </svg>
        </button>
      </div>
      <ShortcutsPanel open={shortcutsPanelOpen} onClose={() => setShortcutsPanelOpen(false)} />
  </footer>
);
};

export default BottomBar;
