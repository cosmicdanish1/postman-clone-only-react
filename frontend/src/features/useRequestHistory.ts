import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

export interface RequestHistoryData {
  id: number;
  method: string;
  url: string;
  month: string;
  day: string;
  year: string;
  time: string;
  created_at: string;
}

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
            created_at: item.created_at || createdAt.toISOString()
          };
        });

        setHistory(transformedItems);
        return { success: true, count: transformedItems.length };
      } else {
        const errorMsg = 'Invalid response format';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch history';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a new request to history
  const saveRequest = useCallback(async (requestData: Omit<RequestHistoryData, 'id' | 'created_at'>) => {
    console.log('=== useRequestHistory.saveRequest called with:', requestData);
    
    try {
      const dataToSave = {
        ...requestData,
        id: 0,
        created_at: new Date().toISOString()
      };
      
      console.log('Calling apiService.saveRequest with:', dataToSave);
      const response = await apiService.saveRequest(dataToSave);
      console.log('apiService.saveRequest response:', response);
      
      if (response.success) {
        console.log('Request saved successfully, refreshing history...');
        // Refresh the history after saving
        await fetchHistory();
        return { success: true };
      } else {
        const errorMsg = response.error || 'Failed to save request';
        console.error('Error saving request:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error in saveRequest:', errorMessage, err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchHistory]);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    saveRequest,
    refreshHistory: fetchHistory
  };
};
