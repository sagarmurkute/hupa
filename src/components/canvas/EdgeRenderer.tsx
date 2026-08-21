import React, { useState } from 'react';
import type { UPGEdge, UPGNode, RelationshipTypeDefinition } from '../../types/graph';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { calculateBezierPath } from '../../utils/geometry';

interface EdgeRendererProps {
  edge: UPGEdge;
  sourceNode: UPGNode;
  targetNode: UPGNode;
  customType?: RelationshipTypeDefinition;
  isSelected: boolean;
  onSelect: (edgeId: string, multi?: boolean) => void;
  onContextMenu: (e: React.MouseEvent, edgeId: string) => void;
}

export const EdgeRenderer: React.FC<EdgeRendererProps> = ({
  edge,
  sourceNode,
  targetNode,
  customType,
  isSelected,
  onSelect,
  onContextMenu,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const relDef = customType || BUILTIN_RELATIONSHIP_TYPES[edge.type] || BUILTIN_RELATIONSHIP_TYPES.uses;

  const srcW = sourceNode.size?.width || 240;
  const srcH = sourceNode.size?.height || 76;
  const tgtW = targetNode.size?.width || 240;
  const tgtH = targetNode.size?.height || 76;

  // Calculate endpoint coordinates
  const p1 = {
    x:
      edge.sourceHandle === 'right'
        ? sourceNode.position.x + srcW
        : edge.sourceHandle === 'left'
        ? sourceNode.position.x
        : sourceNode.position.x + srcW / 2,
    y:
      edge.sourceHandle === 'bottom'
        ? sourceNode.position.y + srcH
        : edge.sourceHandle === 'top'
        ? sourceNode.position.y
        : sourceNode.position.y + srcH / 2,
  };

  const p2 = {
    x:
      edge.targetHandle === 'right'
        ? targetNode.position.x + tgtW
        : edge.targetHandle === 'left'
        ? targetNode.position.x
        : targetNode.position.x + tgtW / 2,
    y:
      edge.targetHandle === 'bottom'
        ? targetNode.position.y + tgtH
        : edge.targetHandle === 'top'
        ? targetNode.position.y
        : targetNode.position.y + tgtH / 2,
  };

  const { path, midPoint } = calculateBezierPath(
    p1,
    p2,
    edge.sourceHandle || 'right',
    edge.targetHandle || 'left'
  );

  const strokeDasharray =
    edge.lineStyle === 'dashed' || relDef?.lineStyle === 'dashed'
      ? '5, 4'
      : edge.lineStyle === 'dotted' || relDef?.lineStyle === 'dotted'
      ? '2, 3'
      : undefined;

  const strokeColor = isSelected ? '#0f172a' : isHovered ? '#1e293b' : '#64748b';
  const strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 1.5;

  return (
    <g
      className={`hupa-edge-group ${isSelected ? 'is-selected' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(edge.id, e.shiftKey || e.ctrlKey || e.metaKey);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, edge.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible Hit Testing Path */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ pointerEvents: 'stroke' }}
      />

      {/* Selected Halo Ring */}
      {isSelected && (
        <path
          d={path}
          fill="none"
          stroke="rgba(15, 23, 42, 0.12)"
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}

      {/* Visible Bezier Edge Curve */}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        markerEnd={`url(#marker-${edge.type})`}
        className="hupa-edge-path"
      />

      {/* Midpoint Label Badge */}
      <g
        transform={`translate(${midPoint.x}, ${midPoint.y})`}
        style={{ pointerEvents: 'auto' }}
      >
        <rect
          x={-(Math.max(40, (edge.label || edge.type).length * 6 + 12) / 2)}
          y={-10}
          width={Math.max(40, (edge.label || edge.type).length * 6 + 12)}
          height={20}
          rx={4}
          fill="#ffffff"
          stroke={isSelected ? '#0f172a' : isHovered ? '#94a3b8' : '#e2e8f0'}
          strokeWidth={isSelected ? 1.5 : 1}
          style={{ filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.05))' }}
        />
        <text
          x={0}
          y={3}
          textAnchor="middle"
          className="edge-label-badge"
          style={{
            fill: isSelected ? '#0f172a' : '#475569',
            fontWeight: isSelected ? 600 : 500,
          }}
        >
          {edge.label || edge.type}
        </text>
      </g>
    </g>
  );
};
