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
    pendingConnection,
  } = useGraphStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isTargetHovered, setIsTargetHovered] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; initialNodeX: number; initialNodeY: number }>({
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
  });

  const resizeStartRef = useRef<{ startX: number; startY: number; initialW: number; initialH: number }>({
    startX: 0,
    startY: 0,
    initialW: 250,
    initialH: 80,
  });

  const isConnecting = pendingConnection !== null;
  const isSourceNode = pendingConnection?.sourceNodeId === node.id;
  const isEligibleTarget = isConnecting && !isSourceNode;

  // Calculate dependency / edge count
  const depCount = Object.values(edges).filter((e) => e.sourceNodeId === node.id || e.targetNodeId === node.id).length;

  const nodeWidth = node.size?.width || 250;
  const nodeHeight = node.size?.height || 80;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('.handle') ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('.resize-handle')
    ) {
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

      let newW = Math.max(200, resizeStartRef.current.initialW + dx);
      let newH = Math.max(70, resizeStartRef.current.initialH + dy);

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

  // Handle connection start from any handle
  const handleStartConnection = (
    e: React.MouseEvent,
    handlePos: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    e.stopPropagation();
    e.preventDefault();
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

  // Handle connection drop onto this node or its handles
  const handleCompleteDrop = (
    e: React.MouseEvent,
    targetHandle: 'top' | 'right' | 'bottom' | 'left' = 'left'
  ) => {
    const currentPending = useGraphStore.getState().pendingConnection;
    if (currentPending && currentPending.sourceNodeId !== node.id) {
      e.stopPropagation();
      e.preventDefault();
      openRelationshipPicker(
        currentPending.sourceNodeId,
        node.id,
        currentPending.sourceHandle,
        targetHandle
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'review':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      case 'blocked':
      case 'deprecated':
        return '#ef4444';
      default:
        return '#9ea5b1';
    }
  };

  return (
    <div
      id={`node-${node.id}`}
      className={`node ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: `${nodeWidth}px`,
        minHeight: `${nodeHeight}px`,
        zIndex: isSelected ? 20 : isDragging ? 19 : isConnecting ? 15 : 10,
        position: 'absolute',
        borderColor: isTargetHovered && isEligibleTarget
          ? 'var(--indigo)'
          : isSelected
          ? '#111418'
          : 'var(--border)',
        boxShadow: isTargetHovered && isEligibleTarget
          ? '0 0 0 3px rgba(79, 70, 229, 0.25), var(--shadow)'
          : isSelected
          ? '0 0 0 2px rgba(17, 20, 24, 0.1), var(--shadow)'
          : 'var(--shadow-xs)',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={(e) => {
        if (isEligibleTarget) {
          handleCompleteDrop(e, 'left');
        }
      }}
      onMouseEnter={() => {
        if (isEligibleTarget) setIsTargetHovered(true);
      }}
      onMouseLeave={() => {
        setIsTargetHovered(false);
      }}
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
              backgroundColor: 'var(--bg2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            <DynamicIcon name={typeDef.icon || 'Box'} size={12} color="var(--text)" />
          </div>

          <div className="node-title" title={node.name}>
            {node.name}
          </div>

          {/* Status Dot */}
          <div
            title={`Status: ${node.status}`}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(node.status),
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
        <span className="tag type">{node.type}</span>

        <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          ● {depCount} • v{node.version || '0.1.0'}
        </div>
      </div>

      {/* Connection Handles (North, South, East, West) */}
      <div className="handles" style={{ pointerEvents: 'none' }}>
        <div
          className="handle n"
          title="Connect Top"
          onMouseDown={(e) => handleStartConnection(e, 'top')}
          onMouseUp={(e) => handleCompleteDrop(e, 'top')}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -50%)',
            width: '9px',
            height: '9px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            pointerEvents: 'auto',
            opacity: isSelected || isConnecting ? 1 : 0.6,
          }}
        />
        <div
          className="handle e"
          title="Connect Right"
          onMouseDown={(e) => handleStartConnection(e, 'right')}
          onMouseUp={(e) => handleCompleteDrop(e, 'right')}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(50%, -50%)',
            width: '9px',
            height: '9px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            pointerEvents: 'auto',
            opacity: isSelected || isConnecting ? 1 : 0.6,
          }}
        />
        <div
          className="handle s"
          title="Connect Bottom"
          onMouseDown={(e) => handleStartConnection(e, 'bottom')}
          onMouseUp={(e) => handleCompleteDrop(e, 'bottom')}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translate(-50%, 50%)',
            width: '9px',
            height: '9px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            pointerEvents: 'auto',
            opacity: isSelected || isConnecting ? 1 : 0.6,
          }}
        />
        <div
          className="handle w"
          title="Connect Left"
          onMouseDown={(e) => handleStartConnection(e, 'left')}
          onMouseUp={(e) => handleCompleteDrop(e, 'left')}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '9px',
            height: '9px',
            background: 'white',
            border: '2px solid var(--indigo)',
            borderRadius: '50%',
            cursor: 'crosshair',
            pointerEvents: 'auto',
            opacity: isSelected || isConnecting ? 1 : 0.6,
          }}
        />
      </div>

      {/* Resize Grip (Bottom-Right) */}
      <div
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          right: '3px',
          bottom: '3px',
          width: '7px',
          height: '7px',
          cursor: 'nwse-resize',
          opacity: isSelected ? 0.6 : 0.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Resize node"
      >
        <svg width="5" height="5" viewBox="0 0 6 6" fill="none">
          <path d="M5 1L1 5M5 3L3 5M5 5H5.01" stroke="#9ea5b1" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
