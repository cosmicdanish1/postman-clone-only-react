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
