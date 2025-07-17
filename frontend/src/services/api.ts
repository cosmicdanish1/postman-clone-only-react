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
  is_favorite: boolean;
}

// Response type for list endpoints
export interface ListResponse<T> {
  items: T[];
  count: number;
}

// Response type for save operations
export interface SaveHistoryResult {
  success: boolean;
  id?: number;
  error?: string;
}

// Response type for API operations
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface GraphQLEndpointHistoryData {
  id: number;
  url: string;
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
        body: JSON.stringify(requestData)
      });

      console.log('Request sent to:', requestUrl);
      console.log('Request body:', requestData);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      return data;
    } catch (error) {
      console.error('Error saving request:', error);
      throw error;
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
  
  // Delete a single history item
  async deleteHistory(id: number): Promise<ApiResponse> {
    const requestUrl = `${API_BASE_URL}/history/${id}`;
    
    try {
      const response = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Delete history response:', data);
      
      return data;
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }
  },

  // Toggle favorite status
  async toggleFavorite(id: number): Promise<ApiResponse> {
    const requestUrl = `${API_BASE_URL}/history/${id}/favorite`;
    
    try {
      const response = await fetch(requestUrl, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Toggle favorite response:', data);
      
      return data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
  },

  // Save GraphQL endpoint to history
  async saveGraphQLEndpointHistory(data: { url: string }): Promise<ApiResponse<GraphQLEndpointHistoryData>> {
    const requestUrl = `${API_BASE_URL}/graphql-endpoints`;
    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving GraphQL endpoint history:', error);
      throw error;
    }
  },

  // Get GraphQL endpoint history
  async getGraphQLEndpointHistory(): Promise<GraphQLEndpointHistoryData[]> {
    const requestUrl = `${API_BASE_URL}/graphql-endpoints`;
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching GraphQL endpoint history:', error);
      throw error;
    }
  },

  // Delete a single GraphQL endpoint+query history item
  async deleteGraphQLEndpointHistory(id: number): Promise<ApiResponse> {
    const requestUrl = `${API_BASE_URL}/graphql-endpoints/${id}`;
    try {
      const response = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting GraphQL endpoint history item:', error);
      throw error;
    }
  }
};
