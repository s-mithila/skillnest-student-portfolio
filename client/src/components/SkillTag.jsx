// client/src/components/SkillTag.jsx
// Interactive or informational skill pill badge

import React from 'react';
import { X } from 'lucide-react';

export function SkillTag({ skill, onRemove, onClick, isClickable = false }) {
  const name = typeof skill === 'string' ? skill : skill.skill_name;

  return (
    <span
      className={`skill-tag ${isClickable || onClick ? 'clickable' : ''}`}
      onClick={onClick ? () => onClick(name) : undefined}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          className="skill-tag-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          title={`Remove ${name}`}
        >
          <X size={13} />
        </button>
      )}
    </span>
  );
}

