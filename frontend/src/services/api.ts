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
  count?: number;
}

export const apiService = {
  // Save request to history
  async saveRequest(historyData: Omit<RequestHistoryData, 'id' | 'created_at'>): Promise<ApiResponse<RequestHistoryData>> {
    const requestUrl = `${API_BASE_URL}/history`;
    
    console.log('=== apiService.saveRequest called ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Request URL:', requestUrl);
    
    // Add current date and time to the request
    const now = new Date();
    const requestData = {
      method: historyData.method,
      url: historyData.url,
      month: String(now.getMonth() + 1).padStart(2, '0'),
      day: String(now.getDate()).padStart(2, '0'),
      year: String(now.getFullYear()),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    console.log('=== FRONTEND: Sending Request ===');
    console.log('URL:', requestUrl);
    console.log('Method:', 'POST');
    console.log('Headers:', JSON.stringify({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }, null, 2));
    console.log('Body:', JSON.stringify(requestData, null, 2));

    try {
      console.log('Making fetch request to:', requestUrl);
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid JSON response from server');
      }
      
      return { success: true, data };
      
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
    const requestUrl = `${API_BASE_URL}/history`;
    
    console.log('Fetching history from:', requestUrl);
    
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('History response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('History data received:', data);
      
      return {
        items: data.items || [],
        count: data.count || 0
      };
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },
  
  // Clear all history
  async clearHistory(): Promise<ApiResponse> {
    const requestUrl = `${API_BASE_URL}/history`;
    
    console.log('Clearing history at:', requestUrl);
    
    try {
      const response = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Clear history response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Clear history response data:', data);
      
      return data;
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }
};
