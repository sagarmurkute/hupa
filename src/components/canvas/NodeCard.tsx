import React, { useState, useRef, useEffect } from 'react';
import type { UPGNode, NodeTypeDefinition } from '../../types/graph';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { useGraphStore } from '../../store/useGraphStore';
import { DynamicIcon } from '../common/DynamicIcon';
import { snapToGrid } from '../../utils/geometry';
import { GitFork, ArrowDownRight } from 'lucide-react';

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
    initialW: 240,
    initialH: 76,
  });

  const isConnecting = pendingConnection !== null;
  const isSourceNode = pendingConnection?.sourceNodeId === node.id;
  const isEligibleTarget = isConnecting && !isSourceNode;

  // Zoom Level of Detail (LOD)
  const currentZoom = transform.zoom;
  const isMacroView = currentZoom < 0.55;
  const isDetailView = currentZoom > 1.25;

  const nodeWidth = node.size?.width || 240;
  const nodeHeight = node.size?.height || (isMacroView ? 44 : 76);

  // Live dependency count
  const depCount = Object.values(edges).filter((e) => e.sourceNodeId === node.id || e.targetNodeId === node.id).length;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('.node-handle-dot') ||
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

  // Handle resizing
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
      let newH = Math.max(50, resizeStartRef.current.initialH + dy);

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
        return '#059669';
      case 'in-progress':
        return '#d97706';
      case 'blocked':
      case 'deprecated':
        return '#e11d48';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div
      id={`node-${node.id}`}
      className={`hupa-node ${isSelected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''} ${
        isEligibleTarget && isHovered ? 'is-connection-target' : ''
      } ${isSourceNode ? 'is-connection-source' : ''}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: `${nodeWidth}px`,
        minHeight: `${nodeHeight}px`,
        position: 'absolute',
        padding: isMacroView ? '6px 10px' : '10px 12px',
        justifyContent: isMacroView ? 'center' : 'space-between',
        zIndex: isSelected ? 30 : isDragging ? 35 : isConnecting ? 25 : 15,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseUp={(e) => {
        if (isEligibleTarget) handleCompleteDrop(e, 'left');
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
      {/* 1. MACRO VIEW (When Zoom < 0.55) */}
      {isMacroView ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(node.status),
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
            }}
          >
            {node.name}
          </div>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {node.type}
          </span>
        </div>
      ) : (
        /* 2. STANDARD & DETAIL VIEW */
        <>
          <div>
            {/* Top Identity Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '9.5px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface-subtle)',
                    padding: '1px 5px',
                    borderRadius: '3px',
                  }}
                >
                  <DynamicIcon name={typeDef.icon || 'Box'} size={10} color="var(--text-secondary)" />
                  {typeDef.label}
                </span>

                <div
                  title={`Status: ${node.status}`}
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(node.status),
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* SubGraph Subsystem Drill-down Indicator */}
              {node.subGraphId && (
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--accent-indigo)',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                  title="Nested Subsystem Graph (Double click to enter)"
                >
                  <GitFork size={10} /> Subsystem ↗
                </span>
              )}
            </div>

            {/* Title */}
            <div
              style={{
                fontWeight: 600,
                fontSize: '12.5px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={node.name}
            >
              {node.name}
            </div>

            {/* Description (2-line clamp) */}
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.35',
                marginTop: '3px',
                display: '-webkit-box',
                WebkitLineClamp: isDetailView ? 3 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '14px',
              }}
            >
              {node.description || 'No architectural description.'}
            </div>
          </div>

          {/* Bottom Metadata / Deep Detail Tier */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '6px',
              paddingTop: '5px',
              borderTop: '1px solid var(--surface-subtle)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <span>v{node.version || '0.1.0'}</span>

            {isDetailView && node.owner && (
              <span style={{ color: 'var(--text-secondary)' }}>@{node.owner}</span>
            )}

            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ArrowDownRight size={10} /> {depCount} rels
            </span>
          </div>
        </>
      )}

      {/* 4 Precision Magnetic Handles (North, South, East, West) */}
      {(isHovered || isSelected || isConnecting) && (
        <>
          {/* North */}
          <div
            className="node-handle-dot"
            style={{ left: '50%', top: 0, transform: 'translate(-50%, -50%)' }}
            title="Connect North"
            onMouseDown={(e) => handleStartConnection(e, 'top')}
            onMouseUp={(e) => handleCompleteDrop(e, 'top')}
          />
          {/* East */}
          <div
            className="node-handle-dot"
            style={{ right: 0, top: '50%', transform: 'translate(50%, -50%)' }}
            title="Connect East"
            onMouseDown={(e) => handleStartConnection(e, 'right')}
            onMouseUp={(e) => handleCompleteDrop(e, 'right')}
          />
          {/* South */}
          <div
            className="node-handle-dot"
            style={{ left: '50%', bottom: 0, transform: 'translate(-50%, 50%)' }}
            title="Connect South"
            onMouseDown={(e) => handleStartConnection(e, 'bottom')}
            onMouseUp={(e) => handleCompleteDrop(e, 'bottom')}
          />
          {/* West */}
          <div
            className="node-handle-dot"
            style={{ left: 0, top: '50%', transform: 'translate(-50%, -50%)' }}
            title="Connect West"
            onMouseDown={(e) => handleStartConnection(e, 'left')}
            onMouseUp={(e) => handleCompleteDrop(e, 'left')}
          />
        </>
      )}

      {/* Bottom-right Corner Resize Grip */}
      {(isHovered || isSelected) && (
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            right: '2px',
            bottom: '2px',
            width: '8px',
            height: '8px',
            cursor: 'nwse-resize',
            opacity: 0.4,
          }}
          title="Resize node"
        >
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M5 1L1 5M5 3L3 5M5 5H5.01" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
};
