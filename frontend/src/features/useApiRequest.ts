// File: useApiRequest.ts
// Type: Custom Hook
// Imports: Redux hooks, actions
// Imported by: Components that need to make API requests
// Role: Handles API requests and updates Redux store
// Located at: src/features/useApiRequest.ts

import { useCallback } from 'react';
import { useAppDispatch } from './restHooks';
import { sendRequestStart, sendRequestSuccess, sendRequestFailure } from './restSlice';
import type { TabData } from './restTypes';
import { apiService } from '../services/api';

export const useApiRequest = () => {
  const dispatch = useAppDispatch();

  const makeRequest = useCallback(async (tab: TabData) => {
    const { id: tabId, method, url, headers: tabHeaders, parameters } = tab;
    
    try {
      dispatch(sendRequestStart());
      
      // Build URL with query parameters
      const urlObj = new URL(url);
      parameters
        .filter(param => param.enabled && param.key)
        .forEach(param => {
          urlObj.searchParams.append(param.key, param.value);
        });
      
      // Prepare headers
      const headers: Record<string, string> = {};
      tabHeaders
        .filter(header => header.enabled && header.key)
        .forEach(header => {
          headers[header.key] = header.value;
        });
      
      // Add default headers if not present
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      
      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers,
        // TODO: Add body handling based on content type
      };
      
      const requestUrl = urlObj.toString();
      const response = await fetch(requestUrl, requestOptions);
      
      // Save to history
      try {
        const now = new Date();
        await apiService.saveRequest({
          method,
          url: requestUrl,
          month: String(now.getMonth() + 1).padStart(2, '0'),
          day: String(now.getDate()).padStart(2, '0'),
          year: String(now.getFullYear()),
          time: now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })
        });
      } catch (error) {
        console.error('Failed to save request to history:', error);
        // Don't fail the request if history save fails
      }
      
      // Handle different response types
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      // Convert headers to a plain object
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      const responseDataObj = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        size: response.headers.get('content-length') || 
                  (typeof responseData === 'string' 
                    ? responseData.length 
                    : JSON.stringify(responseData).length),
      };
      
      dispatch(sendRequestSuccess({ tabId, response: responseDataObj }));
      
      return responseData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(sendRequestFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  return { makeRequest };
};
