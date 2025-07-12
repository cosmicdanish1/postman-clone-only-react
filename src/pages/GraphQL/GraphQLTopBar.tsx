// File: GraphQLTopBar.tsx
// Type: Component (top bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the endpoint input and connect button for the GraphQL page.
// Located at: src/pages/GraphQL/GraphQLTopBar.tsx
import React, { useState } from 'react';
import useAccentColor from '../../hooks/useAccentColor';
import useThemeClass from '../../hooks/useThemeClass';

const GraphQLTopBar: React.FC = () => {
  const [endpoint, setEndpoint] = useState('https://echo.hoppscotch.io/graphql');
  const { themeClass } = useThemeClass();

  return (
    <div className={`flex items-center gap-4 p-4 border-b border-border bg-bg text-text ${themeClass}`}>
      <input
        className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
        placeholder="https://echo.hoppscotch.io/graphql"
        value={endpoint}
        onChange={e => setEndpoint(e.target.value)}
      />
      <button 
      className="text-white px-8 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
      style={{ backgroundColor: useAccentColor() }}
    >
      Connect
    </button>
    </div>
  );
};

export default GraphQLTopBar; 