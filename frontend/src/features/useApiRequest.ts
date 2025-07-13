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
      
      const startTime = Date.now();
      const response = await fetch(urlObj.toString(), requestOptions);
      const endTime = Date.now();
      
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
      
      dispatch(
        sendRequestSuccess({
          tabId,
          response: {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            data: responseData,
            time: endTime - startTime,
            size: response.headers.get('content-length') || 
                  (typeof responseData === 'string' 
                    ? responseData.length 
                    : JSON.stringify(responseData).length),
          },
        })
      );
      
      return responseData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(sendRequestFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  return { makeRequest };
};
