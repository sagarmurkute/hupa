import React, { useState } from 'react';
import type { UPGGroup } from '../../types/graph';
import { useGraphStore } from '../../store/useGraphStore';
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
      className="group"
      style={{
        left: `${group.position.x}px`,
        top: `${group.position.y}px`,
        width: `${group.size.width}px`,
        height: isCollapsed ? '44px' : `${group.size.height}px`,
        borderColor: isSelected ? 'var(--indigo)' : '#d7dae0',
        backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.05)' : 'rgba(246, 247, 249, 0.6)',
        boxShadow: isSelected ? '0 0 0 2px rgba(79, 70, 229, 0.15)' : 'none',
        pointerEvents: 'auto',
        transition: 'height 0.2s ease, border-color 0.15s ease',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectGroup(group.id, e.shiftKey || e.ctrlKey);
      }}
    >
      {/* Floating Group Label Pill */}
      <div className="group-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={toggleCollapse}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text2)',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </button>
        <span>{group.name}</span>
        <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
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
              color: '#ef4444',
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
