import React, { useState, useRef, useEffect } from 'react';
import type { UPGNode, NodeTypeDefinition, NodePosition } from '@hupa/core';
import { BUILTIN_NODE_TYPES } from '@hupa/shared';
import { useGraphStore } from '@hupa/state';
import { DynamicIcon } from '@hupa/ui';
import { snapToGrid, getHandleCoordinates } from '@hupa/graph';
import type { HandlePosition } from '@hupa/graph';
import { GitFork, ArrowDownRight, User } from 'lucide-react';

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
    updateMultipleNodePositions,
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

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialPositions: Record<string, NodePosition>;
  }>({
    startX: 0,
    startY: 0,
    initialPositions: {},
  });

  const isConnecting = pendingConnection !== null;
  const isSourceNode = pendingConnection?.sourceNodeId === node.id;
  const isEligibleTarget = isConnecting && !isSourceNode;

  // Zoom Level of Detail (LOD)
  const currentZoom = transform.zoom;
  const isMacroView = currentZoom < 0.5;
  const isDetailView = currentZoom > 1.15;

  const nodeWidth = node.size?.width || 260;
  const nodeHeight = node.size?.height || (isMacroView ? 44 : 110);
  const nodeSize = { width: nodeWidth, height: nodeHeight };

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
      
      const currentSelected = useGraphStore.getState().selectedNodeIds;
      let activeSelected = currentSelected;
      if (!isMulti && !currentSelected.includes(node.id)) {
        selectNode(node.id, false);
        activeSelected = [node.id];
      } else if (isMulti) {
        selectNode(node.id, true);
        activeSelected = currentSelected.includes(node.id)
          ? currentSelected.filter((id) => id !== node.id)
          : [...currentSelected, node.id];
      }

      // Collect initial positions for all nodes being dragged
      const initPositions: Record<string, NodePosition> = {};
      const allNodes = useGraphStore.getState().nodes;
      activeSelected.forEach((id) => {
        if (allNodes[id]) {
          initPositions[id] = { ...allNodes[id].position };
        }
      });
      if (!initPositions[node.id]) {
        initPositions[node.id] = { ...node.position };
      }

      setIsDragging(true);
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPositions: initPositions,
      };
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStartRef.current.startX) / transform.zoom;
      const dy = (e.clientY - dragStartRef.current.startY) / transform.zoom;

      const targetIds = Object.keys(dragStartRef.current.initialPositions);
      if (targetIds.length <= 1) {
        let newX = (dragStartRef.current.initialPositions[node.id]?.x ?? node.position.x) + dx;
        let newY = (dragStartRef.current.initialPositions[node.id]?.y ?? node.position.y) + dy;

        if (isSnapToGrid) {
          newX = snapToGrid(newX);
          newY = snapToGrid(newY);
        }

        updateNodePosition(node.id, { x: newX, y: newY });
      } else {
        const nextPositions: Record<string, NodePosition> = {};
        targetIds.forEach((id) => {
          const initPos = dragStartRef.current.initialPositions[id];
          if (initPos) {
            let nx = initPos.x + dx;
            let ny = initPos.y + dy;
            if (isSnapToGrid) {
              nx = snapToGrid(nx);
              ny = snapToGrid(ny);
            }
            nextPositions[id] = { x: nx, y: ny };
          }
        });
        updateMultipleNodePositions(nextPositions);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      useGraphStore.getState().saveToStorage();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, transform.zoom, isSnapToGrid, node.id, node.position, updateNodePosition, updateMultipleNodePositions]);

  // Handle resizing
  const resizeStartRef = useRef<{ startX: number; startY: number; initialW: number; initialH: number }>({
    startX: 0,
    startY: 0,
    initialW: 260,
    initialH: 110,
  });

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
      useGraphStore.getState().saveToStorage();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, transform.zoom, isSnapToGrid, node.id, updateNodeSize]);

  // Handle connection start from any handle
  const handleStartConnection = (e: React.MouseEvent, handlePos: HandlePosition) => {
    e.stopPropagation();
    e.preventDefault();
    const pt = getHandleCoordinates(node.position, nodeSize, handlePos);
    startConnection(node.id, handlePos, pt.x, pt.y);
  };

  // Handle connection drop onto this node or its handles
  const handleCompleteDrop = (e: React.MouseEvent, targetHandle: HandlePosition = 'left') => {
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return { color: '#059669', bg: '#ecfdf5', label: 'Active' };
      case 'review':
        return { color: '#2563eb', bg: '#eff6ff', label: 'Review' };
      case 'in-progress':
        return { color: '#d97706', bg: '#fffbeb', label: 'In Progress' };
      case 'blocked':
        return { color: '#e11d48', bg: '#fff1f2', label: 'Blocked' };
      case 'deprecated':
        return { color: '#94a3b8', bg: '#f8fafc', label: 'Deprecated' };
      default:
        return { color: '#64748b', bg: '#f1f5f9', label: 'Planned' };
    }
  };

  const statusConfig = getStatusConfig(node.status);

  // Extract key property pairs to showcase on the card (up to 2)
  const keyProperties = Object.entries(node.properties || {})
    .filter(([k]) => !['description', 'title', 'id'].includes(k))
    .slice(0, 2);

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
        pointerEvents: 'auto',
        padding: isMacroView ? '8px 12px' : '10px 12px',
        justifyContent: isMacroView ? 'center' : 'space-between',
        zIndex: isSelected ? 40 : isDragging ? 45 : isConnecting ? 30 : 20,
        borderTop: `3px solid ${typeDef.color || '#0f172a'}`,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: isSelected
          ? '0 0 0 1.5px #0f172a, 0 10px 24px -2px rgba(15, 23, 42, 0.12)'
          : isHovered
          ? '0 6px 18px rgba(15, 23, 42, 0.08)'
          : '0 1px 3px rgba(15, 23, 42, 0.05)',
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
      {/* 1. MACRO VIEW (When Zoomed Out) */}
      {isMacroView ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusConfig.color,
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
              fontSize: '9.5px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {node.type}
          </span>
        </div>
      ) : (
        /* 2. STANDARD & RICH DETAIL VIEW */
        <>
          <div>
            {/* Top Identity & Status Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              {/* Type Chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '9.5px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface-subtle)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <DynamicIcon name={typeDef.icon || 'Box'} size={11} color="var(--text-secondary)" />
                  {typeDef.label}
                </span>

                {/* Priority Badge if High/Critical */}
                {node.priority && (node.priority === 'critical' || node.priority === 'high') && (
                  <span
                    style={{
                      fontSize: '8.5px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor: node.priority === 'critical' ? '#ffe4e6' : '#fef3c7',
                      color: node.priority === 'critical' ? '#e11d48' : '#b45309',
                    }}
                  >
                    {node.priority}
                  </span>
                )}
              </div>

              {/* Status Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: statusConfig.bg,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  color: statusConfig.color,
                }}
              >
                <div
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: statusConfig.color,
                  }}
                />
                <span>{statusConfig.label}</span>
              </div>
            </div>

            {/* Title & Subsystem drill-down */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.3',
                  wordBreak: 'break-word',
                  flex: 1,
                }}
                title={node.name}
              >
                {node.name}
              </div>

              {node.subGraphId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    drillIntoNode(node.id);
                  }}
                  style={{
                    fontSize: '10px',
                    color: 'var(--accent-indigo)',
                    backgroundColor: 'rgba(79, 70, 229, 0.08)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                  title="Drill into nested subsystem graph"
                >
                  <GitFork size={10} /> Subsystem ↗
                </button>
              )}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.35',
                marginTop: '4px',
                display: '-webkit-box',
                WebkitLineClamp: isDetailView ? 3 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '14px',
              }}
            >
              {node.description || 'No architectural description.'}
            </div>

            {/* Tech Stack & Key Properties (Richer Info!) */}
            {((node.tags && node.tags.length > 0) || keyProperties.length > 0) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '6px' }}>
                {/* Tags */}
                {(node.tags || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '9.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: 'var(--surface-subtle)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}

                {/* Key Properties */}
                {keyProperties.map(([key, val]) => (
                  <span
                    key={key}
                    style={{
                      fontSize: '9.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      maxWidth: '120px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={`${key}: ${val}`}
                  >
                    <strong>{key}:</strong> {String(val)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Metadata Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '8px',
              paddingTop: '6px',
              borderTop: '1px solid var(--surface-subtle)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <span>v{node.version || '1.0.0'}</span>

            {node.owner && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--text-secondary)' }}>
                <User size={10} /> {node.owner}
              </span>
            )}

            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
            opacity: 0.45,
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
