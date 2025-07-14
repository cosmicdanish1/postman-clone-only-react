const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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

// Response type for list endpoints
interface ListResponse<T> {
  items: T[];
  count: number;
}

// Response type for API operations
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const apiService = {
  // Save request to history
  async saveRequest(historyData: Omit<RequestHistoryData, 'id' | 'created_at'>): Promise<ApiResponse<RequestHistoryData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        return { 
          success: false, 
          error: `Server error: ${response.status} ${response.statusText}`,
          message: errorText
        };
      }
      
      const data = await response.json();
      console.log('Save response:', data);
      return data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error saving request:', errorMessage, error);
      return { 
        success: false, 
        error: `Failed to save request: ${errorMessage}`
      };
    }
  },

  // Get request history
  async getHistory(): Promise<ListResponse<RequestHistoryData>> {
    try {
      console.log('Making request to:', `${API_BASE_URL}/history`);
      const response = await fetch(`${API_BASE_URL}/history`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        // For list responses, we'll return an empty list on error
        return { items: [], count: 0 };
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Ensure we have a valid response format
      if (data && Array.isArray(data.items) && typeof data.count === 'number') {
        return data;
      } else {
        console.error('Unexpected response format:', data);
        return { items: [], count: 0 };
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching history:', errorMessage, error);
      // Return empty list on error
      return { items: [], count: 0 };
    }
  }
};
