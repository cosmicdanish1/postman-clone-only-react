// File: Sidebar.tsx
// Type: Component (sidebar navigation)
// Imports: React, utility functions, and possibly navigation helpers
// Imported by: Layout.tsx
// Role: Renders the main sidebar navigation for the app.
// Located at: src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store';


const Sidebar: React.FC = () => {
  const location = useLocation();
  const expandNav = useSelector((state: RootState) => state.settings.expandNav);
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  // Tabs with i18n
  const tabs = [
    {
      label: t('rest'),
      to: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link2-icon lucide-link-2">
          <path d="M9 17H7A5 5 0 0 1 7 7h2" />
          <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
          <line x1="8" x2="16" y1="12" y2="12" />
        </svg>
      ),
    },
    {
      label: t('graphql'),
      to: '/graphql',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="18" height="18" viewBox="0 0 21 24">
          <path fill="currentColor" d="M12.731 2.751 17.666 5.6a2.138 2.138 0 1 1 2.07 3.548l-.015.003v5.7a2.14 2.14 0 1 1-2.098 3.502l-.002-.002-4.905 2.832a2.14 2.14 0 1 1-4.079.054l-.004.015-4.941-2.844a2.14 2.14 0 1 1-2.067-3.556l.015-.003V9.15a2.14 2.14 0 1 1 1.58-3.926l-.01-.005c.184.106.342.231.479.376l.001.001 4.938-2.85a2.14 2.14 0 1 1 4.096.021l.004-.015zm-.515.877a.766.766 0 0 1-.057.057l-.001.001 6.461 11.19c.026-.009.056-.016.082-.023V9.146a2.14 2.14 0 0 1-1.555-2.603l-.003.015.019-.072zm-3.015.059-.06-.06-4.946 2.852A2.137 2.137 0 0 1 2.749 9.12l-.015.004-.076.021v5.708l.084.023 6.461-11.19zm2.076.507a2.164 2.164 0 0 1-1.207-.004l.015.004-6.46 11.189c.286.276.496.629.597 1.026l.003.015h12.911c.102-.413.313-.768.599-1.043l.001-.001L11.28 4.194zm.986 16.227 4.917-2.838a1.748 1.748 0 0 1-.038-.142H4.222l-.021.083 4.939 2.852c.39-.403.936-.653 1.54-.653.626 0 1.189.268 1.581.696l.001.002z"/>
        </svg>
      ),
    },
    {
      label: t('realtime'),
      to: '/realtime',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe-icon lucide-globe">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      label: t('settings'),
      to: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-bg text-text transition-all duration-300 ${expandNav ? 'w-20' : 'w-16'} ${themeClass} z-[50]`}
      style={{ zIndex: 50 }}
    >
      {/* Sidebar options */}
      <nav className="flex-1 flex flex-col gap-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className="flex flex-col items-center group relative w-full "
            >
              <span
                title={tab.label}
                className={`w-full flex flex-col items-center py-3.5 relative ${isActive ? 'bg-accent/10 text-accent font-bold' : 'text-text/70'} opacity-80 hover:opacity-100 transition-all duration-200`}
              >
                {tab.icon}
                {expandNav && (
                  <span className={`text-[11px] mt-1 ${isActive ? 'text-accent' : 'text-text/70'} group-hover:text-accent`}>
                    {tab.label}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l" />
                )}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 