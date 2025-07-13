const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestHistoryData {
  method: string;
  url: string;
  month: string;
  day: string;
  year: string;
  time: string;
}

export const apiService = {
  // Save request to history
  async saveRequest(historyData: RequestHistoryData): Promise<ApiResponse<RequestHistoryData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/test-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving request:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save request' 
      };
    }
  },

  // Get request history
  async getHistory(): Promise<ApiResponse<RequestHistoryData[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/test-db`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch history' 
      };
    }
  }
};
