import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ConnectionTest = () => {
  const [message, setMessage] = useState('Testing connection...');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessage(`✅ Backend is running! Status: ${data.status}`);
      } catch (err) {
        setError(`❌ Error connecting to backend: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Connection Test</h2>
      <div className="p-4 bg-gray-50 rounded">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest;
