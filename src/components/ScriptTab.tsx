import React from 'react';

const ScriptTab: React.FC<{ label: string }> = ({ label }) => (
  <div className="space-y-2">
    <label className="block text-zinc-300 text-sm font-semibold mb-1">{label}</label>
    <textarea
      className="w-full min-h-[100px] bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none resize-y"
      placeholder={`// Write your ${label.toLowerCase()} here...`}
    />
    <div className="text-xs text-zinc-400 mt-2">Scripting is not yet implemented.</div>
  </div>
);

export default ScriptTab; 