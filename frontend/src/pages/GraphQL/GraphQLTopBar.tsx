// File: GraphQLTopBar.tsx
// Type: Component (top bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the endpoint input and connect button for the GraphQL page.
// Located at: src/pages/GraphQL/GraphQLTopBar.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

const GraphQLTopBar: React.FC = () => {
  const { t } = useTranslation();
  const [endpoint, setEndpoint] = useState('https://echo.hoppscotch.io/graphql');
  const { themeClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  return (
    <div className={`flex items-center gap-4 p-4 bg-bg text-text ${themeClass}`}>
      <input
        className="flex-1 bg-bg rounded px-4 py-2 text-text focus:outline-none"
        placeholder={t('graphql.endpoint_placeholder')}
        value={endpoint}
        onChange={e => setEndpoint(e.target.value)}
      />
      <button 
        className="px-8 py-2 rounded font-semibold text-white transition-opacity"
        style={{ backgroundColor: accentColor }}
      >
        {t('graphql.connect')}
      </button>
    </div>
  );
};

export default GraphQLTopBar; 