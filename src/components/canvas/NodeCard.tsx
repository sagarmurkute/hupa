import React, { useState, useRef, useEffect } from 'react';
import type { UPGNode, NodeTypeDefinition } from '../../types/graph';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { useGraphStore } from '../../store/useGraphStore';
import { DynamicIcon } from '../common/DynamicIcon';
import { snapToGrid } from '../../utils/geometry';
import { GitFork, CornerDownRight, ArrowUpRight } from 'lucide-react';

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
    graphs,
    edges,
  } = useGraphStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; initialNodeX: number; initialNodeY: number }>({
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
  });

  const resizeStartRef = useRef<{ startX: number; startY: number; initialW: number; initialH: number }>({
    startX: 0,
    startY: 0,
    initialW: 210,
    initialH: 110,
  });

  // Calculate dependency / edge count
  const incomingCount = Object.values(edges).filter((e) => e.targetNodeId === node.id).length;
  const outgoingCount = Object.values(edges).filter((e) => e.sourceNodeId === node.id).length;

  // Sub-graph information
  const subGraph = node.subGraphId ? graphs[node.subGraphId] : null;
  const subGraphNodeCount = subGraph ? subGraph.nodeIds.length : 0;

  const nodeWidth = node.size?.width || 210;
  const nodeHeight = node.size?.height || 110;

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

      let newW = Math.max(180, resizeStartRef.current.initialW + dx);
      let newH = Math.max(90, resizeStartRef.current.initialH + dy);

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

  const getStatusDotBg = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return '#09090b';
      case 'in-progress':
        return '#3f3f46';
      case 'review':
        return '#71717a';
      case 'blocked':
      case 'deprecated':
        return '#a1a1aa';
      default:
        return '#d4d4d8';
    }
  };

  return (
    <div
      id={`node-${node.id}`}
      style={{
        position: 'absolute',
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        transform: 'translate3d(0, 0, 0)',
        zIndex: isSelected ? 20 : isDragging ? 19 : 10,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: `1.5px solid ${isSelected ? '#09090b' : '#e4e4e7'}`,
        boxShadow: isSelected
          ? '0 0 0 2px #09090b, 0 12px 24px -4px rgba(0,0,0,0.18)'
          : isHovered
          ? '0 12px 20px -4px rgba(0,0,0,0.12)'
          : '0 2px 6px -2px rgba(0,0,0,0.06)',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.15s ease, border-color 0.15s ease',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {/* Accent strip on top */}
      <div
        style={{
          height: '3px',
          width: '100%',
          backgroundColor: '#09090b',
          borderTopLeftRadius: '6px',
          borderTopRightRadius: '6px',
          flexShrink: 0,
        }}
      />

      <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
        {/* Top meta row */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '9.5px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                backgroundColor: '#f4f4f5',
                color: '#18181b',
                border: '1px solid #e4e4e7',
              }}
            >
              <DynamicIcon name={typeDef.icon || 'Box'} size={11} color="#18181b" />
              <span>{typeDef.label}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                title={`Status: ${node.status}`}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: getStatusDotBg(node.status),
                  border: '1px solid #d4d4d8',
                }}
              />
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {node.status}
              </span>
            </div>
          </div>

          {/* Node Name */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#09090b',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {node.name}
            </span>
            {node.version && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  color: 'var(--text-subtle)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                v{node.version}
              </span>
            )}
          </div>

          {/* Description */}
          {node.description && (
            <div
              style={{
                fontSize: '10.5px',
                color: '#52525b',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: Math.max(1, Math.floor((nodeHeight - 75) / 14)),
                WebkitBoxOrient: 'vertical',
              }}
            >
              {node.description}
            </div>
          )}
        </div>

        {/* Footer info: Connections & Nested Graph trigger */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '4px',
            borderTop: '1px solid #f4f4f5',
            fontSize: '9.5px',
            color: 'var(--text-muted)',
            marginTop: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span title={`${incomingCount} incoming relations`} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <CornerDownRight size={10} /> {incomingCount}
            </span>
            <span title={`${outgoingCount} outgoing relations`} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={10} /> {outgoingCount}
            </span>
          </div>

          {/* Sub-graph Drill Down Button */}
          {node.subGraphId || subGraphNodeCount > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                drillIntoNode(node.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '1px 5px',
                borderRadius: '4px',
                border: '1px solid #18181b',
                backgroundColor: '#18181b',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Drill into nested sub-graph"
            >
              <GitFork size={9} />
              <span>Subsystem ({subGraphNodeCount})</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                drillIntoNode(node.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '1px 4px',
                borderRadius: '4px',
                border: '1px solid #e4e4e7',
                backgroundColor: '#f4f4f5',
                color: '#3f3f46',
                fontSize: '8.5px',
                cursor: 'pointer',
              }}
              title="Create nested sub-graph"
            >
              <GitFork size={8} />
              <span>Expand</span>
            </button>
          )}
        </div>
      </div>

      {/* Resize Handle (Bottom-Right corner) */}
      <div
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          right: '2px',
          bottom: '2px',
          width: '10px',
          height: '10px',
          cursor: 'nwse-resize',
          opacity: isHovered || isSelected ? 0.6 : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 26,
        }}
        title="Drag to resize node"
      >
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M5 1L1 5M5 3L3 5M5 5H5.01" stroke="#71717a" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Connection Handles (Top, Right, Bottom, Left) */}
      <div
        className="handle handle-top"
        title="Connect from top"
        onMouseDown={(e) => handleStartConnection(e, 'top')}
        onMouseUp={(e) => handleMouseUpOnNode(e, 'top')}
        style={{
          position: 'absolute',
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '2px solid #09090b',
          cursor: 'crosshair',
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.15s ease',
          zIndex: 25,
        }}
      />

      <div
        className="handle handle-right"
        title="Connect from right"
        onMouseDown={(e) => handleStartConnection(e, 'right')}
        onMouseUp={(e) => handleMouseUpOnNode(e, 'right')}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-5px',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '2px solid #09090b',
          cursor: 'crosshair',
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.15s ease',
          zIndex: 25,
        }}
      />

      <div
        className="handle handle-bottom"
        title="Connect from bottom"
        onMouseDown={(e) => handleStartConnection(e, 'bottom')}
        onMouseUp={(e) => handleMouseUpOnNode(e, 'bottom')}
        style={{
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '2px solid #09090b',
          cursor: 'crosshair',
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.15s ease',
          zIndex: 25,
        }}
      />

      <div
        className="handle handle-left"
        title="Connect from left"
        onMouseDown={(e) => handleStartConnection(e, 'left')}
        onMouseUp={(e) => handleMouseUpOnNode(e, 'left')}
        style={{
          position: 'absolute',
          top: '50%',
          left: '-5px',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '2px solid #09090b',
          cursor: 'crosshair',
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.15s ease',
          zIndex: 25,
        }}
      />
    </div>
  );
};
