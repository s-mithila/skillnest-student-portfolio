// client/src/components/ErrorMessage.jsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorMessage({ message = 'An error occurred.', onRetry }) {
  return (
    <div className="alert alert-danger" style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem' }}>
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
}

