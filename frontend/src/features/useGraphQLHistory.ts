import { useState, useCallback } from 'react';
import { apiService, type GraphQLEndpointHistoryData } from '../services/api';

export function useGraphQLHistory() {
  const [history, setHistory] = useState<GraphQLEndpointHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch GraphQL history
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await apiService.getGraphQLEndpointHistory();
      setHistory(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a new entry
  const saveHistory = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.saveGraphQLEndpointHistory({ url });
      await fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  // Delete an entry
  const deleteHistory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteGraphQLEndpointHistory(id);
      await fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    fetchHistory,
    saveHistory,
    deleteHistory,
  };
}
