import React, { useState, useRef, useEffect } from 'react';
import type { UPGNode, NodeTypeDefinition } from '../../types/graph';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { useGraphStore } from '../../store/useGraphStore';
import { DynamicIcon } from '../common/DynamicIcon';
import { snapToGrid } from '../../utils/geometry';

interface NodeCardProps {
  node: UPGNode;
  customType?: NodeTypeDefinition;
  isSelected: boolean;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  customType,
  isSelected,
  onContextMenu,
}) => {
  const typeDef = customType || BUILTIN_NODE_TYPES[node.type] || BUILTIN_NODE_TYPES.custom;
  const {
    selectNode,
    updateNodePosition,
    updateNodeSize,
    startConnection,
    openRelationshipPicker,
    drillIntoNode,
    isSnapToGrid,
    transform,
    edges,
  } = useGraphStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; initialNodeX: number; initialNodeY: number }>({
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
  });

  const resizeStartRef = useRef<{ startX: number; startY: number; initialW: number; initialH: number }>({
    startX: 0,
    startY: 0,
    initialW: 264,
    initialH: 100,
  });

  // Calculate dependency / edge count
  const depCount = Object.values(edges).filter((e) => e.sourceNodeId === node.id || e.targetNodeId === node.id).length;

  const nodeWidth = node.size?.width || 264;
  const nodeHeight = node.size?.height || 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.handle') || (e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }

    if (e.button === 0) {
      e.stopPropagation();
      const isMulti = e.shiftKey || e.metaKey || e.ctrlKey;
      selectNode(node.id, isMulti);

      setIsDragging(true);
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialNodeX: node.position.x,
        initialNodeY: node.position.y,
      };
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStartRef.current.startX) / transform.zoom;
      const dy = (e.clientY - dragStartRef.current.startY) / transform.zoom;

      let newX = dragStartRef.current.initialNodeX + dx;
      let newY = dragStartRef.current.initialNodeY + dy;

      if (isSnapToGrid) {
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);
      }

      updateNodePosition(node.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, transform.zoom, isSnapToGrid, node.id, updateNodePosition]);

  // Resizing logic
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialW: nodeWidth,
      initialH: nodeHeight,
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - resizeStartRef.current.startX) / transform.zoom;
      const dy = (e.clientY - resizeStartRef.current.startY) / transform.zoom;

      let newW = Math.max(220, resizeStartRef.current.initialW + dx);
      let newH = Math.max(88, resizeStartRef.current.initialH + dy);

      if (isSnapToGrid) {
        newW = snapToGrid(newW);
        newH = snapToGrid(newH);
      }

      updateNodeSize(node.id, { width: newW, height: newH });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, transform.zoom, isSnapToGrid, node.id, updateNodeSize]);

  // Handle connection start
  const handleStartConnection = (
    e: React.MouseEvent,
    handlePos: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    e.stopPropagation();
    const handleCoordX =
      handlePos === 'right'
        ? node.position.x + nodeWidth
        : handlePos === 'left'
        ? node.position.x
        : node.position.x + nodeWidth / 2;
    const handleCoordY =
      handlePos === 'bottom'
        ? node.position.y + nodeHeight
        : handlePos === 'top'
        ? node.position.y
        : node.position.y + nodeHeight / 2;

    startConnection(node.id, handlePos, handleCoordX, handleCoordY);
  };

  // Handle connection drop onto this node
  const handleMouseUpOnNode = (
    e: React.MouseEvent,
    targetHandle: 'top' | 'right' | 'bottom' | 'left' = 'left'
  ) => {
    const { pendingConnection } = useGraphStore.getState();
    if (pendingConnection && pendingConnection.sourceNodeId !== node.id) {
      e.stopPropagation();
      openRelationshipPicker(
        pendingConnection.sourceNodeId,
        node.id,
        pendingConnection.sourceHandle,
        targetHandle
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'stable':
        return '#10b981';
      case 'in-progress':
      case 'development':
        return '#f59e0b';
      case 'blocked':
      case 'deprecated':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const statusColor = getStatusColor(node.status);

  return (
    <div
      id={`node-${node.id}`}
      className={`node ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: `${nodeWidth}px`,
        minHeight: `${nodeHeight}px`,
        zIndex: isSelected ? 20 : isDragging ? 19 : 10,
        position: 'absolute',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        drillIntoNode(node.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, node.id);
      }}
    >
      <div>
        {/* Header Row */}
        <div className="node-header">
          <div
            className="node-icon"
            style={{
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              color: 'var(--indigo)',
              border: '1px solid rgba(79, 70, 229, 0.15)',
            }}
          >
            <DynamicIcon name={typeDef.icon || 'Box'} size={14} color="var(--indigo)" />
          </div>

          <div className="node-title" title={node.name}>
            {node.name}
          </div>

          {/* Status Dot */}
          <div
            title={`Status: ${node.status}`}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusColor,
              flexShrink: 0,
            }}
          />

          {/* Subsystem child indicator */}
          {node.subGraphId && (
            <div className="child-ind" title="Contains nested subsystem (Double-click to dive)">
              ↗
            </div>
          )}
        </div>

        {/* Description */}
        <div className="node-desc">
          {node.description || 'No description provided.'}
        </div>
      </div>

      {/* Footer */}
      <div className="node-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="tag type">{node.type}</span>
          {node.priority === 'critical' && (
            <span className="tag" style={{ background: '#fef2f2', color: '#e11d48', borderColor: '#fecdd3' }}>
              critical
            </span>
          )}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          ● {depCount} • v{node.version || '0.1.0'}
        </div>
      </div>

      {/* Connection Handles (North, South, East, West) */}
      <div className="handles">
        <div
          className="handle n"
          title="Connect from Top"
          onMouseDown={(e) => handleStartConnection(e, 'top')}
          onMouseUp={(e) => handleMouseUpOnNode(e, 'top')}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            opacity: isSelected ? 1 : 0.85,
          }}
        />
        <div
          className="handle e"
          title="Connect from Right"
          onMouseDown={(e) => handleStartConnection(e, 'right')}
          onMouseUp={(e) => handleMouseUpOnNode(e, 'right')}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(50%, -50%)',
            width: '10px',
            height: '10px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            opacity: isSelected ? 1 : 0.85,
          }}
        />
        <div
          className="handle s"
          title="Connect from Bottom"
          onMouseDown={(e) => handleStartConnection(e, 'bottom')}
          onMouseUp={(e) => handleMouseUpOnNode(e, 'bottom')}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translate(-50%, 50%)',
            width: '10px',
            height: '10px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            opacity: isSelected ? 1 : 0.85,
          }}
        />
        <div
          className="handle w"
          title="Connect from Left"
          onMouseDown={(e) => handleStartConnection(e, 'left')}
          onMouseUp={(e) => handleMouseUpOnNode(e, 'left')}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            opacity: isSelected ? 1 : 0.85,
          }}
        />
      </div>

      {/* Resize Grip (Bottom-Right) */}
      <div
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          right: '4px',
          bottom: '4px',
          width: '8px',
          height: '8px',
          cursor: 'nwse-resize',
          opacity: isSelected ? 0.6 : 0.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Resize node"
      >
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M5 1L1 5M5 3L3 5M5 5H5.01" stroke="#9aa0ad" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
