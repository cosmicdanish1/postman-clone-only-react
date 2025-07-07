import React, { useState } from 'react';

const GraphQLTopBar: React.FC = () => {
  const [endpoint, setEndpoint] = useState('https://echo.hoppscotch.io/graphql');

  return (
    <div className="flex items-center gap-4 p-4 border-b border-[#232329]">
      <input
        className="flex-1 bg-[#232329] border-none rounded px-4 py-2 text-white focus:outline-none"
        placeholder="https://echo.hoppscotch.io/graphql"
        value={endpoint}
        onChange={e => setEndpoint(e.target.value)}
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold">Connect</button>
    </div>
  );
};

export default GraphQLTopBar; 