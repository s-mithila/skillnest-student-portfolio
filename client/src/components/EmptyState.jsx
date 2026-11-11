// client/src/components/EmptyState.jsx
import React from 'react';
import { FolderX } from 'lucide-react';

export function EmptyState({
  icon: Icon = FolderX,
  title = 'No items found',
  description = 'There are currently no items to display in this section.',
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#0f172a' }}>{title}</h3>
      <p style={{ maxWidth: 420, margin: '0 auto 1.25rem', fontSize: '0.9rem' }}>{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
}

