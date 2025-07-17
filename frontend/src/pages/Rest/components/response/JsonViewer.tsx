import React from 'react';

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

  const displayData = data || {
    message: "Make a request to see the response data here",
    status: "idle",
    data: []
  };

  return (
    <div className="h-full overflow-auto">
      <pre className="whitespace-pre-wrap font-mono text-sm p-2">
        {JSON.stringify(displayData, null, 2)}
      </pre>
    </div>
  );
};

export default JsonViewer;
