import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type BodyType = 'raw' | 'form-data' | 'x-www-form-urlencoded' | 'binary' | 'graphql';

const BodyTab: React.FC = () => {
  const [bodyType, setBodyType] = useState<BodyType>('raw');

  const renderBodyContent = () => {
    switch (bodyType) {
      case 'raw':
        return (
          <div className="space-y-2">
            <label className="block text-zinc-300 text-sm font-semibold mb-1">Raw JSON</label>
            <textarea
              className="w-full min-h-[120px] bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none resize-y"
              placeholder={`{
  "key": "value"
}`}
            />
            <div className="text-xs text-zinc-400 mt-2">Other body types (form-data, x-www-form-urlencoded) can be added later.</div>
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

  return (
    <div className="space-y-4" style={{ background: 'red' }}>
      {/* Body Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700 rounded-t-md">
        <span className="text-gray-400 text-sm">Body</span>
        <div className="flex items-center gap-3">
          {/* Placeholder for icons/buttons, e.g., Help, Clear, Edit, Add */}
          <span className="text-zinc-500 text-xs">[icons here]</span>
        </div>
      </div>
      {/* Body Type Selector */}
      <div className="flex gap-2 border-b border-zinc-700">
        {(['raw', 'form-data', 'x-www-form-urlencoded', 'binary', 'graphql'] as BodyType[]).map((type) => (
          <button
            key={type}
            onClick={() => setBodyType(type)}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors duration-150 focus:outline-none ${
              bodyType === type
                ? 'text-violet-400 border-b-2 border-violet-500'
                : 'text-zinc-400 hover:text-zinc-300'
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