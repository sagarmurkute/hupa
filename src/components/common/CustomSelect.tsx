import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  color?: string;
  badge?: string;
  description?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  style = {},
  disabled = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as HTMLElement)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const height = size === 'sm' ? '24px' : size === 'lg' ? '34px' : '28px';
  const fontSize = size === 'sm' ? '11px' : '11.5px';

  return (
    <div
      ref={dropdownRef}
      className={`custom-select-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height,
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          backgroundColor: disabled ? 'var(--surface-subtle)' : '#ffffff',
          border: `1px solid ${isOpen ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
          borderRadius: '5px',
          fontSize,
          fontWeight: 500,
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 1px #0f172a' : 'none',
          transition: 'all 0.12s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
          {selectedOption?.color && (
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: selectedOption.color,
                flexShrink: 0,
              }}
            />
          )}

          {selectedOption?.icon && typeof selectedOption.icon === 'string' && (
            <DynamicIcon name={selectedOption.icon} size={12} color="var(--text-secondary)" />
          )}
          {selectedOption?.icon && typeof selectedOption.icon !== 'string' && selectedOption.icon}

          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={12}
          color="var(--text-muted)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown Options Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 150,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '3px',
            animation: 'fadeIn 100ms ease-out',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '5px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? 'var(--surface-subtle)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize,
                  fontWeight: isSelected ? 600 : 400,
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                  {option.color && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: option.color,
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {option.icon && typeof option.icon === 'string' && (
                    <DynamicIcon name={option.icon} size={12} color="var(--text-secondary)" />
                  )}
                  {option.icon && typeof option.icon !== 'string' && option.icon}

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{option.label}</span>
                    {option.description && (
                      <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>

                {option.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor: 'var(--surface-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {option.badge}
                  </span>
                )}

                {isSelected && <Check size={12} color="#0f172a" style={{ flexShrink: 0 }} />}
              </div>
            );
          })}

          {options.length === 0 && (
            <div style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};
