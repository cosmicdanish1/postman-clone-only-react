// File: GraphQLTopBar.tsx
// Type: Component (top bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the endpoint input and connect button for the GraphQL page.
// Located at: src/pages/GraphQL/GraphQLTopBar.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

interface GraphQLTopBarProps {
  initialEndpoint?: string;
  onEndpointChange: (endpoint: string) => void;
}

const GraphQLTopBar: React.FC<GraphQLTopBarProps> = ({ 
  initialEndpoint = 'https://echo.hoppscotch.io/graphql',
  onEndpointChange 
}) => {
  const { t } = useTranslation();
  const [endpoint, setEndpoint] = useState(initialEndpoint);
  const { themeClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  // Update local state when initialEndpoint prop changes
  useEffect(() => {
    if (initialEndpoint) {
      setEndpoint(initialEndpoint);
    }
  }, [initialEndpoint]);

  return (
    <div className={`flex items-center gap-4 p-4 bg-bg text-text ${themeClass}`}>
      <input
        className="flex-1 bg-bg rounded px-4 py-2 text-text focus:outline-none border border-gray-700 focus:border-blue-500 transition-colors"
        placeholder={t('graphql.endpoint_placeholder')}
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onEndpointChange(endpoint);
          }
        }}
      />
      <button 
        className="px-8 py-2 rounded font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: accentColor }}
        onClick={() => onEndpointChange(endpoint)}
      >
        {t('graphql.connect')}
      </button>
    </div>
  );
};

export default GraphQLTopBar; 