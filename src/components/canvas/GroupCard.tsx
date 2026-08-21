import React, { useState } from 'react';
import type { UPGGroup } from '../../types/graph';
import { useGraphStore } from '../../store/useGraphStore';
import { Folder, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

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
        height: isCollapsed ? '44px' : `${group.size.height}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        border: `1.5px dashed ${isSelected ? '#09090b' : '#a1a1aa'}`,
        borderRadius: '12px',
        zIndex: 5,
        pointerEvents: 'auto',
        transition: 'height 0.2s ease, border-color 0.15s ease',
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectGroup(group.id, e.shiftKey || e.ctrlKey);
      }}
    >
      {/* Group Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: isCollapsed ? 'none' : '1px solid #e4e4e7',
          backgroundColor: '#f4f4f5',
          borderTopLeftRadius: '11px',
          borderTopRightRadius: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#09090b',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
          <Folder size={14} color="#09090b" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#09090b' }}>
            {group.name}
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '999px',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {group.nodeIds.length} nodes
          </span>
        </div>

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
              color: '#71717a',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
