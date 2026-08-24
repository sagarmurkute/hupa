import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface CustomTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const CustomTagInput: React.FC<CustomTagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tag and press Enter...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim().toLowerCase().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 6px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: '5px',
        minHeight: '28px',
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 5px',
            borderRadius: '4px',
            backgroundColor: 'var(--surface-subtle)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            fontWeight: 500,
          }}
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
          >
            <X size={10} />
          </button>
        </span>
      ))}

      <input
        type="text"
        placeholder={tags.length === 0 ? placeholder : 'Add tag...'}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          flex: 1,
          minWidth: '70px',
          background: 'transparent',
          color: 'var(--text-primary)',
          padding: '2px',
        }}
      />

      {inputValue.trim() && (
        <button
          type="button"
          onClick={() => {
            const trimmed = inputValue.trim().toLowerCase().replace(/^#/, '');
            if (trimmed && !tags.includes(trimmed)) {
              onChange([...tags, trimmed]);
              setInputValue('');
            }
          }}
          className="hupa-btn primary"
          style={{ height: '20px', padding: '0 5px', fontSize: '9.5px' }}
        >
          <Plus size={10} /> Add
        </button>
      )}
    </div>
  );
};
