import React, { useMemo } from 'react';
import { FiFilter, FiDownload, FiSave, FiCopy } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
import useThemeClass from '../../../../hooks/useThemeClass';

interface JsonViewerProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data = null,
  loading = false,
  error = null
}) => {
  const { themeClass, borderClass, theme: currentTheme, textClass } = useThemeClass();
  const isDark = currentTheme === 'dark' || currentTheme === 'black';
  const editorTheme = isDark ? 'vs-dark' : 'light';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading JSON data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4">
        Error loading JSON: {error}
      </div>
    );
  }

  const defaultData = {
    "method": "GET",
    "args": {},
    "data": "",
    "headers": {
      "accept-encoding": "gzip",
      "cdn-loop": "netlify",
      "host": "echo.hoppscotch.io",
      "netlify-invocation-source": "client",
      "traceparent": "00-01981859933d60359f12b585351d5861-0c1ab4d1fdc74541-01",
      "user-agent": "Proxyscotch/1.1",
      "x-country": "US",
      "x-forwarded-for": "169.254.169.126:17052, 2600:1900:0:2d07::1501",
      "x-forwarded-proto": "https",
      "x-nf-account-id": "5e2b91527eb7a24fb0054390",
      "x-nf-account-tier": "account_type_pro",
      "x-nf-client-connection-ip": "2600:1900:0:2d07::1501",
      "x-nf-deploy-context": "production",
      "x-nf-deploy-id": "626b1bc6a7f6c1000902602e",
      "x-nf-deploy-published": "1",
      "x-nf-geo": "eyJjaXR5IjoiQ291bmNpbCBCbHVmZnMiLCJjb3VudHJ5Ijp7ImNvZGUiOiJVUyIsIm5hbWUiOiJVbml0ZWQgU3RhdGVzIn0sInBvc3RhbF9jb2RlIjoiNTE1MDIiLCJzdWJkaXZpc2lvbiI6eyJjb2RlIjoiSW93YSIsIm5hbWUiOiJJb3dhIn0sInRpbWV6b25lIjoiQW1lcmljYS9DaGljYWdvIiwibGF0aXR1ZGUiOjQxLjI1OTEsImxvbmdpdHVkZSI6LTk1Ljg1MTd9",
      "x-nf-request-id": "01K0C5K4SXC0TSY4NNGMTHTP31",
      "x-nf-request-start": "1752755180349658626, 1752755180350276501",
      "x-nf-site-id": "5d797a9d-fe11-4582-8837-9986a4673158",
      "x-nf-trace-span-id": "0c1ab4d1fdc74541"
    },
    "path": "/",
    "isBase64Encoded": false
  };

  const displayData = data || defaultData;

  // Format the JSON string for the editor
  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(displayData, null, 2);
    } catch (e) {
      return 'Invalid JSON data';
    }
  }, [displayData]);



  return (
    <div className={`h-full flex flex-col ${themeClass}`}>
      {/* Top bar with title and action buttons */}
      <div className={`flex-shrink-0 flex items-center justify-between px-4 py-2 ${borderClass} ${themeClass} bg-opacity-50`}>
        <span className={`text-sm font-medium ${textClass}`}>Response Body</span>
        <div className="flex items-center space-x-3">
          <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <FiFilter className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <FiDownload className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <FiSave className="w-4 h-4" />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            onClick={() => {
              navigator.clipboard.writeText(jsonString);
            }}
          >
            <FiCopy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Monaco Editor for JSON */}
      <div className={`flex-1 ${themeClass}`} style={{ height: '400px' }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={jsonString}
          theme={editorTheme}
          options={{
            readOnly: true,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            wordWrap: 'on',
            lineNumbers: 'off',
            renderWhitespace: 'none',
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>
    </div>
  );
};

export default JsonViewer;
