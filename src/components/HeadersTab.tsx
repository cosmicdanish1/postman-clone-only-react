import React from 'react';

interface Header {
  key: string;
  value: string;
}

const HeadersTab: React.FC = () => {
  const [headers, setHeaders] = React.useState<Header[]>([{ key: '', value: '' }]);

  const handleHeaderChange = (idx: number, field: 'key' | 'value', value: string) => {
    setHeaders(headers => {
      const updated = [...headers];
      updated[idx][field] = value;
      return updated;
    });
  };

  const addHeader = () => setHeaders(headers => [...headers, { key: '', value: '' }]);

  const removeHeader = (idx: number) => setHeaders(headers => headers.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <div className="flex font-semibold text-zinc-300 text-sm mb-2">
        <div className="w-1/3">Key</div>
        <div className="w-1/3">Value</div>
        <div className="w-1/6"></div>
      </div>
      {headers.map((header, idx) => (
        <div className="flex items-center gap-2" key={idx}>
          <input
            className="w-1/3 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Key"
            value={header.key}
            onChange={e => handleHeaderChange(idx, 'key', e.target.value)}
          />
          <input
            className="w-1/3 bg-zinc-700 text-zinc-200 rounded px-2 py-1 text-sm focus:outline-none"
            placeholder="Value"
            value={header.value}
            onChange={e => handleHeaderChange(idx, 'value', e.target.value)}
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={() => removeHeader(idx)}
            disabled={headers.length === 1}
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        className="mt-2 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-sm font-semibold"
        onClick={addHeader}
        type="button"
      >
        Add
      </button>
    </div>
  );
};

export default HeadersTab; 