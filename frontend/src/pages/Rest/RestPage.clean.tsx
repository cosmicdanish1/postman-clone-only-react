import { useState, useCallback, useEffect, useRef } from 'react';
import type { FC, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Parameter {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

const RestPage: FC = () => {
  // State for the request
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [queryParams, setQueryParams] = useState<Parameter[]>([]);
  const [headers, setHeaders] = useState<Parameter[]>([]);
  const [body, setBody] = useState('');
  const [contentType, setContentType] = useState('application/json');
  const [response, setResponse] = useState('');
  const [activeTab, setActiveTab] = useState('params');
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const methodDropdownRef = useRef<HTMLDivElement>(null);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);

  // Initialize default params and headers on mount
  useEffect(() => {
    if (queryParams.length === 0) {
      setQueryParams([{ id: uuidv4(), key: '', value: '', enabled: true }]);
    }
    if (headers.length === 0) {
      setHeaders([{ id: uuidv4(), key: '', value: '', enabled: true }]);
    }
  }, [queryParams.length, headers.length]);

  // Handle sending the request
  const handleSendRequest = useCallback(async () => {
    if (!url) {
      setResponse('Error: URL is required');
      return;
    }

    try {
      setIsLoading(true);
      setResponse('');

      // Build URL with query parameters
      const urlObj = new URL(url);
      queryParams.forEach(param => {
        if (param.enabled && param.key) {
          urlObj.searchParams.append(param.key, param.value || '');
        }
      });

      // Prepare headers
      const requestHeaders: Record<string, string> = {};
      headers.forEach(header => {
        if (header.enabled && header.key) {
          requestHeaders[header.key] = header.value || '';
        }
      });

      // Add content type header if not already set
      if (body && !requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = contentType;
      }

      // Make the request
      const response = await fetch(urlObj.toString(), {
        method,
        headers: requestHeaders,
        body: method === 'GET' || method === 'HEAD' ? undefined : body,
      });

      // Format the response
      const responseData = await response.text();
      setResponse(responseData);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [url, method, queryParams, headers, body, contentType]);

  // Handle parameter changes
  const handleParamChange = useCallback((id: string, field: keyof Parameter, value: string | boolean) => {
    setQueryParams(prev => 
      prev.map(param => param.id === id ? { ...param, [field]: value } : param)
    );
  }, []);

  // Add a new parameter
  const handleAddParam = useCallback(() => {
    setQueryParams(prev => [
      ...prev,
      { id: uuidv4(), key: '', value: '', enabled: true }
    ]);
  }, []);

  // Delete a parameter
  const handleDeleteParam = useCallback((id: string) => {
    setQueryParams(prev => prev.filter(param => param.id !== id));
  }, []);

  // Handle header changes
  const handleHeaderChange = useCallback((id: string, field: keyof Parameter, value: string | boolean) => {
    setHeaders(prev => 
      prev.map(header => header.id === id ? { ...header, [field]: value } : header)
    );
  }, []);

  // Add a new header
  const handleAddHeader = useCallback(() => {
    setHeaders(prev => [
      ...prev,
      { id: uuidv4(), key: '', value: '', enabled: true }
    ]);
  }, []);

  // Delete a header
  const handleDeleteHeader = useCallback((id: string) => {
    setHeaders(prev => prev.filter(header => header.id !== id));
  }, []);

  // Handle body content changes
  const handleBodyChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  }, []);

  // Handle content type changes
  const handleContentTypeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setContentType(e.target.value);
  }, []);

  // Toggle method dropdown
  const toggleMethodDropdown = useCallback(() => {
    setMethodDropdownOpen(prev => !prev);
  }, []);

  // Handle method selection
  const handleMethodSelect = useCallback((selectedMethod: string) => {
    setMethod(selectedMethod);
    setMethodDropdownOpen(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(event.target as Node)) {
        setMethodDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Method colors for UI
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-purple-100 text-purple-800',
    DELETE: 'bg-red-100 text-red-800',
    HEAD: 'bg-indigo-100 text-indigo-800',
    OPTIONS: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">API Request</h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative" ref={methodDropdownRef}>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-l border ${
                    methodColors[method] || 'bg-gray-100 text-gray-800'
                  } border-gray-300 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 flex items-center`}
                  onClick={toggleMethodDropdown}
                >
                  {method}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {methodDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((httpMethod) => (
                      <button
                        key={httpMethod}
                        type="button"
                        onClick={() => handleMethodSelect(httpMethod)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          methodColors[httpMethod] || 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {httpMethod}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter request URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded disabled:opacity-50 flex items-center"
                onClick={handleSendRequest}
                disabled={isLoading || !url}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {['params', 'headers', 'body'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'params' && (
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="col-span-1">Enabled</div>
                    <div className="col-span-4">Key</div>
                    <div className="col-span-6">Value</div>
                    <div className="col-span-1"></div>
                  </div>
                  {queryParams.map((param) => (
                    <div key={param.id} className="grid grid-cols-12 gap-2 mb-2">
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={(e) => handleParamChange(param.id, 'enabled', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <input
                        type="text"
                        className="col-span-4 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={param.key}
                        onChange={(e) => handleParamChange(param.id, 'key', e.target.value)}
                        placeholder="Key"
                      />
                      <input
                        type="text"
                        className="col-span-6 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={param.value}
                        onChange={(e) => handleParamChange(param.id, 'value', e.target.value)}
                        placeholder="Value"
                      />
                      <div className="col-span-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteParam(param.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Delete parameter"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddParam}
                    className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Parameter
                  </button>
                </div>
              )}

              {activeTab === 'headers' && (
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="col-span-1">Enabled</div>
                    <div className="col-span-4">Key</div>
                    <div className="col-span-6">Value</div>
                    <div className="col-span-1"></div>
                  </div>
                  {headers.map((header) => (
                    <div key={header.id} className="grid grid-cols-12 gap-2 mb-2">
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) => handleHeaderChange(header.id, 'enabled', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <input
                        type="text"
                        className="col-span-4 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={header.key}
                        onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
                        placeholder="Key"
                      />
                      <input
                        type="text"
                        className="col-span-6 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={header.value}
                        onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
                        placeholder="Value"
                      />
                      <div className="col-span-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteHeader(header.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Delete header"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddHeader}
                    className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Header
                  </button>
                </div>
              )}

              {activeTab === 'body' && (
                <div>
                  <div className="mb-2">
                    <select
                      value={contentType}
                      onChange={handleContentTypeChange}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="application/json">JSON</option>
                      <option value="application/xml">XML</option>
                      <option value="application/x-www-form-urlencoded">Form URL-encoded</option>
                      <option value="text/plain">Text</option>
                    </select>
                  </div>
                  <textarea
                    value={body}
                    onChange={handleBodyChange}
                    className="w-full h-64 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      contentType === 'application/json' 
                        ? '{\n  "key": "value"\n}'
                        : 'Enter request body content'
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Response Section */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Response</h2>
            <div className="border border-gray-300 dark:border-gray-600 rounded p-4 h-96 overflow-auto bg-gray-50 dark:bg-gray-800">
              {response ? (
                <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
                  {response}
                </pre>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Send a request to see the response here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestPage;
