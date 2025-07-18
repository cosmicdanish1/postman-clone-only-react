// File: GraphQLSecondaryTabBar.tsx
// Type: Component (secondary tab bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the secondary tab bar for switching between query, variables, headers, and authorization.
// Located at: src/pages/GraphQL/GraphQLSecondaryTabBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

interface GraphQLSecondaryTabBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { key: 'query', label: 'Query' },
  { key: 'variables', label: 'Variables' },
  { key: 'headers', label: 'Headers' },
  { key: 'auth', label: 'Authorization' },
];

const GraphQLSecondaryTabBar: React.FC<GraphQLSecondaryTabBarProps> = ({ activeTab, onChange }) => {
  const { t } = useTranslation();
  // Use theme class hook for consistent theming
  const { themeClass, borderClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();
  return (
    <div className={`flex items-center gap-6 px-4 bg-bg text-text ${themeClass} ${borderClass}`}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-2 py-3 font-semibold transition-colors duration-150 relative`}
          >
            <span className={`relative z-10 ${isActive ? 'text-text' : 'text-gray-400 hover:text-text'}`}>
              {tab.label}
            </span>
            {isActive && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5"
                style={{ backgroundColor: accentColor }}
                layoutId="activeTabIndicator"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default GraphQLSecondaryTabBar; 