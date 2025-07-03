import React from 'react';

const BodyTab: React.FC = () => (
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

export default BodyTab; 