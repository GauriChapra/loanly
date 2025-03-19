import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function BackendHealth() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.checkHealth();
        setStatus(response.status);
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="p-4 rounded-lg bg-gray-100">
      <h2 className="text-lg font-semibold mb-2">Backend Status</h2>
      {status === 'checking' && <p>Checking backend connection...</p>}
      {status === 'healthy' && <p className="text-green-600">Backend is healthy</p>}
      {status === 'error' && (
        <p className="text-red-600">
          Error connecting to backend: {error}
        </p>
      )}
    </div>
  );
} 