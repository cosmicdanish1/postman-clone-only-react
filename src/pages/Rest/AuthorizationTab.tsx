// File: AuthorizationTab.tsx
// Type: Component (tab for request authorization)
// Imports: React
// Imported by: RestPage.tsx or request editor
// Role: Renders the UI for configuring request authorization in the REST feature.
// Located at: src/pages/Rest/AuthorizationTab.tsx
import React from 'react';

const authTypes = ['Bearer Token', 'Basic Auth', 'API Key'];

const AuthorizationTab: React.FC = () => {
  const [selectedType, setSelectedType] = React.useState(authTypes[0]);

  return (
    <div className="space-y-4">
      <div className="flex gap-6 mb-2">
        {authTypes.map(type => (
          <label key={type} className="flex items-center gap-1 text-zinc-300 text-sm cursor-pointer">
            <input
              type="radio"
              name="authType"
              value={type}
              checked={selectedType === type}
              onChange={() => setSelectedType(type)}
              className="accent-violet-600"
            />
            {type}
          </label>
        ))}
      </div>
      {selectedType === 'Bearer Token' && (
        <input
          className="w-1/2 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
          placeholder="Bearer Token"
        />
      )}
      {selectedType === 'Basic Auth' && (
        <div className="flex gap-2">
          <input
            className="w-1/4 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Username"
          />
          <input
            className="w-1/4 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Password"
            type="password"
          />
        </div>
      )}
      {selectedType === 'API Key' && (
        <div className="flex gap-2">
          <input
            className="w-1/3 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="API Key"
          />
          <input
            className="w-1/3 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Value"
          />
        </div>
      )}
    </div>
  );
};

export default AuthorizationTab; 