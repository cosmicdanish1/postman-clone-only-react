import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API base URL
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access - please login');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Requested resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const executeRequest = async (config: AxiosRequestConfig) => {
  try {
    const response = await apiClient.request(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      };
    }
    return {
      success: false,
      error: 'An unknown error occurred',
    };
  }
};

export const saveToHistory = async (requestData: {
  method: string;
  url: string;
  status: number;
  statusText: string;
  responseTime: number;
}) => {
  try {
    const response = await apiClient.post('/history', requestData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to save to history:', error);
    return {
      success: false,
      error: 'Failed to save request to history',
    };
  }
};

export default apiClient;
