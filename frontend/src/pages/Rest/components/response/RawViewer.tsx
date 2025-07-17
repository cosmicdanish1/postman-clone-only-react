import React from 'react';

interface RawViewerProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
}

const RawViewer: React.FC<RawViewerProps> = ({ 
  data = null, 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  // Minified JSON data
  const displayText = React.useMemo(() => {
    return `{"method":"GET","args":{},"data":"","headers":{"accept-encoding":"gzip","cdn-loop":"netlify","host":"echo.hoppscotch.io","netlify-invocation-source":"client","traceparent":"00-01981859933d60359f12b585351d5861-0c1ab4d1fdc74541-01","user-agent":"Proxyscotch/1.1","x-country":"US","x-forwarded-for":"169.254.169.126:17052, 2600:1900:0:2d07::1501","x-forwarded-proto":"https","x-nf-account-id":"5e2b91527eb7a24fb0054390","x-nf-account-tier":"account_type_pro","x-nf-client-connection-ip":"2600:1900:0:2d07::1501","x-nf-deploy-context":"production","x-nf-deploy-id":"626b1bc6a7f6c1000902602e","x-nf-deploy-published":"1","x-nf-geo":"eyJjaXR5IjoiQ291bmNpbCBCbHVmZnMiLCJjb3VudHJ5Ijp7ImNvZGUiOiJVUyIsIm5hbWUiOiJVbml0ZWQgU3RhdGVzIn0sInBvc3RhbF9jb2RlIjoiNTE1MDIiLCJzdWJkaXZpc2lvbiI6eyJjb2RlIjoiSUEiLCJuYW1lIjoiSW93YSJ9LCJ0aW1lem9uZSI6IkFtZXJpY2EvQ2hpY2FnbyIsImxhdGl0dWRlIjo0MS4yNTkxLCJsb25naXR1ZGUiOi05NS44NTE3fQ==","x-nf-request-id":"01K0C5K4SXC0TSY4NNGMTHTP31","x-nf-request-start":"1752755180349658626, 1752755180350276501","x-nf-site-id":"5d797a9d-fe11-4582-8837-9986a4673158","x-nf-trace-span-id":"0c1ab4d1fdc74541"},"path":"/","isBase64Encoded":false}`;
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    // Optional: Add toast notification
  };

  const handleDownload = () => {
    const blob = new Blob([displayText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top bar with title and action buttons */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Body</span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Raw text content */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all select-text">{displayText}</pre>
      </div>
    </div>
  );
};

export default RawViewer;
