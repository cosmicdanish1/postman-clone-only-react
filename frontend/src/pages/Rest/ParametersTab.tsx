// File: ParametersTab.tsx
// Type: Component (tab for request parameters)
// Imports: React
// Imported by: RestPage.tsx or request editor
// Role: Renders the UI for editing request parameters in the REST feature.
// Located at: src/pages/Rest/ParametersTab.tsx
import React from 'react';
import { useSelector } from 'react-redux';

interface Param {
  key: string;
  value: string;
}

const ParametersTab: React.FC = () => {
  const [params, setParams] = React.useState<Param[]>([{ key: '', value: '' }]);
  const theme = useSelector((state: any) => state.theme.theme);
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  const handleParamChange = (idx: number, field: 'key' | 'value', value: string) => {
    setParams(params => {
      const updated = [...params];
      updated[idx][field] = value;
      return updated;
    });
  };

  const addParam = () => setParams(params => [...params, { key: '', value: '' }]);

  const removeParam = (idx: number) => setParams(params => params.filter((_, i) => i !== idx));

  return (
    <div className={`space-y-2 bg-bg text-text p-4 rounded ${themeClass}`}>
      
      {params.map((param, idx) => (
        <div className="flex items-center gap-2" key={idx}>
          <input
            className="w-1/3 bg-bg border border-border text-text rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Key"
            value={param.key}
            onChange={e => handleParamChange(idx, 'key', e.target.value)}
          />
          <input
            className="w-1/3 bg-bg border border-border text-text rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Value"
            value={param.value}
            onChange={e => handleParamChange(idx, 'value', e.target.value)}
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={() => removeParam(idx)}
            disabled={params.length === 1}
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        className="mt-2 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-sm font-semibold"
        onClick={addParam}
        type="button"
      >
        Add
      </button>
    </div>
  );
};

export default ParametersTab; 