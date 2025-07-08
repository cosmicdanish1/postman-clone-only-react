// File: GraphQLTopBar.tsx
// Type: Component (top bar for GraphQL page)
// Imports: React
// Imported by: GraphQL.tsx
// Role: Renders the endpoint input and connect button for the GraphQL page.
// Located at: src/pages/GraphQL/GraphQLTopBar.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const GraphQLTopBar: React.FC = () => {
  const [endpoint, setEndpoint] = useState('https://echo.hoppscotch.io/graphql');
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  return (
    <div className={`flex items-center gap-4 p-4 border-b border-border bg-bg text-text ${themeClass}`}>
      <input
        className="flex-1 bg-bg border border-border rounded px-4 py-2 text-text focus:outline-none"
        placeholder="https://echo.hoppscotch.io/graphql"
        value={endpoint}
        onChange={e => setEndpoint(e.target.value)}
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
    </div>
  );
};

export default GraphQLTopBar; 