// File: GraphQLTabBar.tsx
// Type: Component (tab bar for GraphQL tabs)
// Imports: React, FiPlus (react-icons/fi)
// Imported by: GraphQL.tsx
// Role: Renders and manages the tab bar for GraphQL requests, including tab switching, renaming, and closing.
// Located at: src/pages/GraphQL/GraphQLTabBar.tsx
import React, { useRef, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

export interface GraphQLTab {
  id: string;
  tabName: string;
  showModal: boolean;
  modalValue: string;
  activeTab: string;
  query: string;
  variables: any[];
  headers: any[];
}

interface GraphQLTabBarProps {
  tabs: GraphQLTab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onSetModalValue: (id: string, value: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: () => void;
  onOpenModal: (id: string) => void;
  onCloseModal: (id: string) => void;
  onSaveModal: (id: string) => void;
}

const GraphQLTabBar: React.FC<GraphQLTabBarProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onSetModalValue,
  onCloseTab,
  onAddTab,
  onOpenModal,
  onCloseModal,
  onSaveModal,
}) => {
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const barRef = useRef<HTMLDivElement | null>(null);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [hoveredCloseId, setHoveredCloseId] = useState<string | null>(null);
  const { t } = useTranslation();

  // Use theme class hook for consistent theming
  const { themeClass, borderClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTabId];
    if (el) {
      const { left, width } = el.getBoundingClientRect();
      const parentLeft = el.parentElement?.getBoundingClientRect().left || 0;
      setBarStyle({ left: left - parentLeft, width });
    }
  }, [activeTabId, tabs.length]);

  return (
    <div className={`w-full bg-bg h-10 relative flex items-center overflow-x-auto ${themeClass} ${borderClass}`}>
      <div className="flex items-center flex-1 min-w-0 relative" style={{ position: 'relative' }}>
        {/* Animated active tab indicator */}
        <AnimatePresence>
          <motion.div
            ref={barRef}
            className="absolute top-0 h-1 rounded-full"
            style={{
              left: 0,
              width: barStyle.width,
              background: accentColor,
              zIndex: 10,
              pointerEvents: 'none',
            }}
            initial={false}
            animate={{
              x: barStyle.left,
              width: barStyle.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          />
        </AnimatePresence>
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              ref={el => { tabRefs.current[tab.id] = el; }}
              className={`flex items-center h-12 px-4 bg-bg ${themeClass} ${borderClass} select-none transition relative group ${isActive ? 'bg-bg font-bold' : 'text-gray-400 hover:text-text'}`}
              style={{
                ...(isActive ? { color: accentColor } : {}),
                minWidth: 160,
                maxWidth: 240,
                width: 200,
                paddingRight: 24,
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => onTabChange(tab.id)}
              onDoubleClick={() => onOpenModal(tab.id)}
              onMouseEnter={() => setHoveredTabId(tab.id)}
              onMouseLeave={() => { setHoveredTabId(null); setHoveredCloseId(null); }}
            >
              <motion.span 
                className="truncate max-w-[120px] relative z-20"
                initial={false}
                animate={{
                  color: isActive ? accentColor : 'inherit',
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.tabName}
              </motion.span>
              {isActive && (
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-[2px]"
                  style={{ backgroundColor: accentColor }}
                  layoutId="activeTabIndicator"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}
              {tabs.length > 1 && (
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5"
                  style={{ zIndex: 20 }}
                  onMouseEnter={e => { e.stopPropagation(); setHoveredCloseId(tab.id); }}
                  onMouseLeave={e => { e.stopPropagation(); setHoveredCloseId(null); }}
                  onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
                >
                  {hoveredTabId === tab.id ? (
                    hoveredCloseId === tab.id ? (
                      <svg width="16" height="16" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-500 opacity-70 group-hover:opacity-100 transition" />
                    )
                  ) : null}
                </span>
              )}
              {/* Rename modal */}
              {tab.showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className={`bg-bg rounded-2xl shadow-2xl w-[400px] max-w-full p-0 relative ${themeClass}`}>
                    {/* Title and close */}
                    <div className="flex items-center justify-center pt-6 pb-2 px-6 relative">
                      <div className="text-xl font-bold text-center flex-1">{t('graphql.edit_request')}</div>
                      <button className="absolute right-6 top-6 text-gray-400 hover:text-white text-2xl" onClick={() => onCloseModal(tab.id)}>&times;</button>
                    </div>
                    {/* Label and input */}
                    <div className="px-6 pb-2 pt-2">
                      <label className="block text-xs text-gray-400 mb-1">{t('graphql.label')}</label>
                      <div className="relative">
                        <input
                          className="w-full bg-bg rounded px-3 py-3 text-text text-base pr-10 focus:outline-none"
                          value={tab.modalValue}
                          onChange={e => onSetModalValue(tab.id, e.target.value)}
                          autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') onSaveModal(tab.id); if (e.key === 'Escape') onCloseModal(tab.id); }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
                        </span>
                      </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-3 justify-start px-6 pb-6 pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold text-base" onClick={() => onSaveModal(tab.id)}>
                        {t('common.save')}
                      </button>
                      <button className="bg-bg hover:bg-bg/80 text-text px-6 py-2 rounded font-semibold text-base" onClick={() => onCloseModal(tab.id)}>
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <span
          className="flex items-center justify-center h-10 w-10 text-blue-500 text-2xl cursor-pointer hover:bg-[#232326] transition rounded-t-md"
          onClick={onAddTab}
          style={{ zIndex: 20 }}
        >
          <FiPlus />
        </span>
      </div>
    </div>
  );
};

export default GraphQLTabBar; 