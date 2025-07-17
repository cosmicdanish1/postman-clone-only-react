import React, { useEffect } from 'react';
import { useGraphQLHistory } from '../../features/useGraphQLHistory';

interface GraphQLHistoryPanelProps {
  onSelect: (item: { url: string; query: string }) => void;
}

export const GraphQLHistoryPanel: React.FC<GraphQLHistoryPanelProps> = ({ onSelect }) => {
  const { history, loading, error, fetchHistory, deleteHistory } = useGraphQLHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div style={{ width: 320, padding: 16, background: '#fafbfc', borderRight: '1px solid #eee', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>GraphQL History</h3>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {history.length === 0 && !loading && <div>No history yet.</div>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {history.map(item => (
          <li key={item.id} style={{ marginBottom: 12, border: '1px solid #ddd', borderRadius: 6, padding: 10, background: '#fff', position: 'relative' }}>
            <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4, wordBreak: 'break-all' }}>{item.url}</div>
            <pre style={{ fontSize: 12, background: '#f4f5f7', borderRadius: 4, padding: 6, maxHeight: 80, overflow: 'auto', margin: 0 }}>{item.query}</pre>
            <button
              style={{ position: 'absolute', top: 8, right: 8, fontSize: 11, background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 6px' }}
              onClick={() => deleteHistory(item.id)}
              title="Delete"
            >
              🗑
            </button>
            <button
              style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 11, background: '#e0f7fa', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '2px 8px' }}
              onClick={() => onSelect({ url: item.url, query: item.query })}
              title="Open in tab"
            >
              Open
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
