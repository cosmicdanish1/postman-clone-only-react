import React from 'react';

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

const GraphQLSecondaryTabBar: React.FC<GraphQLSecondaryTabBarProps> = ({ activeTab, onChange }) => (
  <div className="flex items-center gap-6 border-b border-[#232329] px-4 bg-[#18181b]">
    {tabs.map(tab => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`px-2 py-3 font-semibold border-b-2 ${activeTab === tab.key ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default GraphQLSecondaryTabBar; 