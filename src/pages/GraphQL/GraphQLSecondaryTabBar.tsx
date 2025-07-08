// File: GraphQLSecondaryTabBar.tsx
// Type: Component (secondary tab bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the secondary tab bar for switching between query, variables, headers, and authorization.
// Located at: src/pages/GraphQL/GraphQLSecondaryTabBar.tsx
import React from 'react';
import { useSelector } from 'react-redux';

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
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)
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