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

    console.log('Sending request to:', requestUrl);
    console.log('Request data:', requestData);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include' as const, // Important for cookies/CORS
      body: JSON.stringify(requestData),
    };

    console.log('=== FRONTEND: Sending Request ===');
    console.log('URL:', requestUrl);
    console.log('Method:', 'POST');
    console.log('Headers:', JSON.stringify(requestOptions.headers, null, 2));
    console.log('Body:', JSON.stringify(requestData, null, 2));

    try {
      console.log('Sending fetch request...');
      const response = await fetch(requestUrl, requestOptions);
      
      console.log('=== FRONTEND: Received Response ===');
      console.log('Status:', response.status, response.statusText);
      
      // Log response headers
      const headers: {[key: string]: string} = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response Headers:', JSON.stringify(headers, null, 2));
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response Body:', JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        const text = await response.text();
        console.log('Raw Response:', text);
        throw new Error(`Invalid JSON response: ${text}`);
      }
      
      if (!response.ok) {
        console.error('Error response from server:', responseData);
        return { 
          success: false, 
          error: responseData.message || `Server responded with status ${response.status}` 
        };
      }
      
      return { success: true, data: responseData };
      
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
