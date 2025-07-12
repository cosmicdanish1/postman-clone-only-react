// File: GraphQLSecondaryTabBar.tsx
// Type: Component (secondary tab bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the secondary tab bar for switching between query, variables, headers, and authorization.
// Located at: src/pages/GraphQL/GraphQLSecondaryTabBar.tsx
import React from 'react';
import useThemeClass from '../../hooks/useThemeClass';

interface GraphQLSecondaryTabBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { key: 'query', label: 'Query' },
  { key: 'variables', label: 'Variables' },
  { key: 'headers', label: 'Headers' },
  { key: 'authorization', label: 'Authorization' },
];

const GraphQLSecondaryTabBar: React.FC<GraphQLSecondaryTabBarProps> = ({ activeTab, onChange }) => {
  // Use theme class hook for consistent theming
  const { themeClass } = useThemeClass();
  return (
    <div className={`flex items-center gap-6 border-b border-border px-4 bg-bg text-text ${themeClass}`}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-2 py-3 font-semibold border-b-2 transition-colors duration-150 ${activeTab === tab.key ? 'border-blue-500 text-text' : 'border-transparent text-gray-400 hover:text-text'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default GraphQLSecondaryTabBar; 