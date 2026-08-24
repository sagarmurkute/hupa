import React, { useState } from 'react';
import type { UPGGroup } from '@hupa/core';
import { useGraphStore } from '@hupa/state';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

interface GroupCardProps {
  group: UPGGroup;
  isSelected: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, isSelected }) => {
  const { selectGroup, updateGroup, deleteGroup } = useGraphStore();
  const [isCollapsed, setIsCollapsed] = useState(group.isCollapsed || false);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    updateGroup(group.id, { isCollapsed: nextCollapsed });
  };

  return (
    <div
      id={`group-${group.id}`}
      style={{
        position: 'absolute',
        left: `${group.position.x}px`,
        top: `${group.position.y}px`,
        width: `${group.size.width}px`,
        height: isCollapsed ? '36px' : `${group.size.height}px`,
        border: `1.5px dashed ${isSelected ? '#0f172a' : '#cbd5e1'}`,
        borderRadius: '10px',
        backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.02)' : 'rgba(241, 245, 249, 0.5)',
        boxShadow: isSelected ? '0 0 0 1.5px #0f172a' : 'none',
        pointerEvents: 'auto',
        transition: 'height 0.15s ease, border-color 0.12s ease',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectGroup(group.id, e.shiftKey || e.ctrlKey);
      }}
    >
      {/* Floating Subsystem Boundary Label Pill */}
      <div
        style={{
          position: 'absolute',
          top: '-11px',
          left: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '5px',
          padding: '2px 8px',
          fontSize: '11px',
          fontWeight: 600,
          color: isSelected ? '#0f172a' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <button
          onClick={toggleCollapse}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </button>
        <span>{group.name}</span>
        <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          ({group.nodeIds.length})
        </span>

        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteGroup(group.id);
            }}
            title="Delete Group"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#e11d48',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              marginLeft: '4px',
            }}
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
  );
};
