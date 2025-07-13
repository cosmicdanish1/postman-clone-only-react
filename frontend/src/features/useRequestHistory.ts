import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

export interface RequestHistory {
  id: number;
  method: string;
  url: string;
  month: string;
  day: string;
  year: string;
  time: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const useRequestHistory = () => {
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history from backend
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getHistory() as ApiResponse<RequestHistory[]>;
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        setError(response.error || 'Failed to load history');
      }
    } catch (err) {
      setError('An error occurred while fetching history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a new request to history
  const saveRequest = useCallback(async (requestData: Omit<RequestHistory, 'id' | 'created_at'>) => {
    try {
      const response = await apiService.saveRequest(requestData);
      if (response.success) {
        // Refresh the history after saving
        await fetchHistory();
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to save request');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchHistory]);

  // Load history when component mounts
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
