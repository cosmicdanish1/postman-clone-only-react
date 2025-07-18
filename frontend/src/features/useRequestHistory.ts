
import { useState, useCallback, useEffect } from 'react';
import { apiService, type RequestHistoryData, type SaveHistoryResult } from '../services/api';

interface FetchHistoryResult {
  success: boolean;
  count?: number;
  error?: string;
}

export const useRequestHistory = () => {
  const [history, setHistory] = useState<RequestHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history from backend
  const fetchHistory = useCallback(async (): Promise<FetchHistoryResult> => {
    console.log('Fetching history...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getHistory();
      console.log('History response:', response);
      
      if (response && response.items && Array.isArray(response.items)) {
        const transformedItems = response.items.map(item => {
          const createdAt = item.created_at ? new Date(item.created_at) : new Date();
          return {
            id: item.id || 0,
            method: item.method || 'GET',
            url: item.url || '',
            month: item.month || String(createdAt.getMonth() + 1).padStart(2, '0'),
            day: item.day || String(createdAt.getDate()).padStart(2, '0'),
            year: item.year || String(createdAt.getFullYear()),
            time: item.time || createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            created_at: item.created_at || createdAt.toISOString(),
            is_favorite: item.is_favorite || false
          };
        });

        setHistory(transformedItems);
        return { success: true, count: response.count };
      } else {
        setHistory([]);
        return { success: true, count: 0 };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch history';
      console.error('Error fetching history:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Save request to history
  const saveRequest = useCallback(async (requestData: Omit<RequestHistoryData, 'id' | 'created_at'>): Promise<SaveHistoryResult> => {
    console.log('Saving request to history:', requestData);
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.saveRequest(requestData);
      console.log('Save history response:', response);
      
      if (response && response.success) {
        await fetchHistory();
        return { success: true, id: response.data?.id };
      } else {
        const errorMsg = response?.error || 'Failed to save history';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error saving history:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  // Delete a single history item
  const deleteHistory = useCallback(async (id: number): Promise<void> => {
    try {
      await apiService.deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (id: number): Promise<void> => {
    try {
      await apiService.toggleFavorite(id);
      setHistory(prev => prev.map(item => 
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, []);

  // Clear all history
  const clearHistory = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    console.log('Clearing history...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.clearHistory();
      console.log('Clear history response:', response);
      
      if (response && response.success) {
        setHistory([]);
        return { success: true };
      } else {
        const errorMsg = response?.error || 'Failed to clear history';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error clearing history:', errorMessage, err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    saveRequest,
    refreshHistory: fetchHistory,
    clearHistory,
    deleteHistory,
    toggleFavorite
  };
};
