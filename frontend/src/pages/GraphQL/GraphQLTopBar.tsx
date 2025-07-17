// File: GraphQLTopBar.tsx
// Type: Component (top bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the endpoint input and connect button for the GraphQL page.
// Located at: src/pages/GraphQL/GraphQLTopBar.tsx
import React, { useState } from 'react';
import useThemeClass from '../../hooks/useThemeClass';
import useAccentColor from '../../hooks/useAccentColor';

interface GraphQLTopBarProps {
  endpoint: string;
  setEndpoint: (val: string) => void;
}

const GraphQLTopBar: React.FC<GraphQLTopBarProps> = ({ endpoint, setEndpoint }) => {
  const { themeClass } = useThemeClass();
  const { current: accentColor } = useAccentColor();

  return (
    <div className={`flex items-center gap-4 p-4 border-b border-border bg-bg text-text ${themeClass}`}>
      <input
        className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
        placeholder="https://echo.hoppscotch.io/graphql"
        value={endpoint}
        onChange={e => setEndpoint(e.target.value)}
      />
      <button
        className="px-8 py-2 rounded font-semibold text-white transition-opacity"
        style={{ backgroundColor: accentColor, boxShadow: `0 2px 8px 0 ${accentColor}33` }}
      >
        Connect
      </button>
    </div>
  );
};

export default GraphQLTopBar;