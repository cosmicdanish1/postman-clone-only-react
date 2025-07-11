// File: BodyTab.tsx
// Type: Component (tab for request body)
// Imports: React
// Imported by: RestPage.tsx or request editor
// Role: Renders the UI for editing the HTTP request body in the REST feature.
// Located at: src/pages/Rest/BodyTab.tsx
import React, { useState } from 'react';

import { useSelector } from 'react-redux';


type BodyType = 'raw' | 'form-data' | 'x-www-form-urlencoded' | 'binary' | 'graphql';

const BodyTab: React.FC = () => {
  const [bodyType, setBodyType] = useState<BodyType>('raw');
    const theme = useSelector((state: any) => state.theme.theme);
  
  // No class for light (default)
  


  const renderBodyContent = () => {
    switch (bodyType) {
      case 'raw':
        return (
          <div className="space-y-2">
            <label className="block text-text text-sm font-semibold mb-1">Raw JSON</label>
            <textarea
              className="w-full min-h-[120px] bg-bg   text-text rounded px-2 py-1 text-sm focus:outline-none resize-y"
              placeholder={`{\n  "key": "value"\n}`}
            />
            <div className="text-xs text-gray-400 mt-2">Other body types (form-data, x-www-form-urlencoded) can be added later.</div>
          </div>
        );
      case 'form-data':
        // Implement form-data rendering
        return null;
      case 'x-www-form-urlencoded':
        // Implement x-www-form-urlencoded rendering
        return null;
      case 'binary':
        // Implement binary rendering
        return null;
      case 'graphql':
        // Implement graphql rendering
        return null;
      default:
        return null;
    }
  };


   let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';


  return (
    <div className={`space-y-4 bg-bg text-text  p-4 rounded ${themeClass}`}>
      {/* Body Bar */}
      <div className="flex items-center justify-between px-4 py-2  rounded-t-md">
        <span className="text-gray-400 text-sm">Body</span>
        <div className="flex items-center gap-3">
          {/* Placeholder for icons/buttons, e.g., Help, Clear, Edit, Add */}
          <span className="text-zinc-500 text-xs">[icons here]</span>
        </div>
      </div>
      {/* Body Type Selector */}
      <div className="flex gap-2 ">
        {(['raw', 'form-data', 'x-www-form-urlencoded', 'binary', 'graphql'] as BodyType[]).map((type) => (
          <button
            key={type}
            onClick={() => setBodyType(type)}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors duration-150 focus:outline-none ${
              bodyType === type
                ? 'text-violet-400 border-b-2 border-violet-500'
                : 'text-gray-400 hover:text-text'
            }`}
          >
            {type === 'x-www-form-urlencoded' ? 'x-www-form-urlencoded' : 
             type === 'form-data' ? 'form-data' :
             type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {/* Body Content */}
      <div className="mt-4">
        {renderBodyContent()}
      </div>
    </div>
  );
};

export default BodyTab; 