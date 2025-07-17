// File: GraphQLSecondaryTabBar.tsx
// Type: Component (secondary tab bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the secondary tab bar for switching between query, variables, headers, and authorization.
// Located at: src/pages/GraphQL/GraphQLSecondaryTabBar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

interface GraphQLSecondaryTabBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { key: 'query', label: 'graphql.tabs.query' },
  { key: 'variables', label: 'graphql.tabs.variables' },
  { key: 'headers', label: 'graphql.tabs.headers' },
  { key: 'authorization', label: 'graphql.tabs.authorization' },
];

const GraphQLSecondaryTabBar: React.FC<GraphQLSecondaryTabBarProps> = ({ activeTab, onChange }) => {
  const { t } = useTranslation();
  // Use theme class hook for consistent theming
  const { themeClass, borderClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();
  return (
    <div className={`flex items-center gap-6 px-4 bg-bg text-text ${themeClass} ${borderClass}`}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-2 py-3 font-semibold transition-colors duration-150 relative ${activeTab === tab.key ? 'text-text' : 'text-gray-400 hover:text-text'}`}
          style={activeTab === tab.key ? { color: accentColor } : {}}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
};

export default GraphQLSecondaryTabBar; 