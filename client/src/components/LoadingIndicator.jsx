// client/src/components/LoadingIndicator.jsx
import React from 'react';

export function LoadingIndicator({ message = 'Loading content...' }) {
  return (
    <div className="loading-box">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}
