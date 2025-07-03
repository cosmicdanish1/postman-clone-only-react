import React from 'react';

interface Param {
  key: string;
  value: string;
}

const ParametersTab: React.FC = () => {
  const [params, setParams] = React.useState<Param[]>([{ key: '', value: '' }]);

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
    <div className="space-y-2">
      <div className="flex font-semibold text-zinc-300 text-sm mb-2">
        <div className="w-1/3">Key</div>
        <div className="w-1/3">Value</div>
        <div className="w-1/6"></div>
      </div>
      {params.map((param, idx) => (
        <div className="flex items-center gap-2" key={idx}>
          <input
            className="w-1/3 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Key"
            value={param.key}
            onChange={e => handleParamChange(idx, 'key', e.target.value)}
          />
          <input
            className="w-1/3 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
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