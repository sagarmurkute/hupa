import React, { useState } from 'react';
import type { UPGEdge, UPGNode, RelationshipTypeDefinition } from '../../types/graph';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { getHandleCoordinates, calculateBezierPath } from '../../utils/geometry';
import type { HandlePosition } from '../../utils/geometry';

interface EdgeRendererProps {
  edge: UPGEdge;
  sourceNode: UPGNode;
  targetNode: UPGNode;
  customType?: RelationshipTypeDefinition;
  isSelected: boolean;
  onSelect: (edgeId: string, multi: boolean) => void;
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
  const relDef = customType || BUILTIN_RELATIONSHIP_TYPES[edge.type] || BUILTIN_RELATIONSHIP_TYPES.custom;

  // Determine handles
  const sourceHandle: HandlePosition = (edge.sourceHandle as HandlePosition) || 'right';
  const targetHandle: HandlePosition = (edge.targetHandle as HandlePosition) || 'left';

  const p1 = getHandleCoordinates(sourceNode.position, sourceNode.size || { width: 210, height: 110 }, sourceHandle);
  const p2 = getHandleCoordinates(targetNode.position, targetNode.size || { width: 210, height: 110 }, targetHandle);

  const { path, midPoint } = calculateBezierPath(p1, p2, sourceHandle, targetHandle);

  const edgeColor = isSelected ? '#0f172a' : isHovered ? '#1e293b' : edge.color || relDef.color || '#64748b';
  const strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 1.5;
  const lineStyle = edge.lineStyle || relDef.lineStyle || 'solid';

  const getStrokeDasharray = () => {
    if (lineStyle === 'dashed') return '5, 4';
    if (lineStyle === 'dotted') return '2, 3';
    return undefined;
  };

  const isAnimated = edge.animated || relDef.animated;
  const labelText = edge.label || edge.type;
  const pillWidth = Math.max(48, labelText.length * 6.5 + 16);

  return (
    <g
      id={`edge-${edge.id}`}
      className="graph-edge-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible hit testing target for hover/click */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(edge.id, e.shiftKey || e.ctrlKey);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e, edge.id);
        }}
      />

      {/* Selected halo ring */}
      {isSelected && (
        <path
          d={path}
          fill="none"
          stroke="#0f172a"
          strokeWidth={6}
          strokeOpacity={0.15}
        />
      )}

      {/* Main visible curve */}
      <path
        d={path}
        fill="none"
        stroke={edgeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeDasharray()}
        markerEnd={`url(#marker-${edge.type})`}
        style={{
          transition: 'stroke 0.12s ease, stroke-width 0.12s ease',
          animation: isAnimated ? 'dashFlow 1.2s linear infinite' : undefined,
        }}
      />

      {/* Interactive Midpoint Label Pill */}
      {labelText && (
        <g
          transform={`translate(${midPoint.x}, ${midPoint.y})`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(edge.id, e.shiftKey || e.ctrlKey);
          }}
        >
          <rect
            x={-(pillWidth / 2)}
            y={-9}
            width={pillWidth}
            height={18}
            rx={9}
            fill="#ffffff"
            stroke={isSelected ? '#0f172a' : isHovered ? '#64748b' : '#cbd5e1'}
            strokeWidth={isSelected ? 1.5 : 1}
            style={{
              filter: isSelected ? 'drop-shadow(0 2px 4px rgba(15,23,42,0.12))' : 'drop-shadow(0 1px 2px rgba(15,23,42,0.05))',
              transition: 'all 0.12s ease',
            }}
          />
          <text
            x={0}
            y={3.5}
            textAnchor="middle"
            fill={isSelected ? '#0f172a' : '#334155'}
            fontSize={9.5}
            fontWeight={600}
            fontFamily="var(--font-mono)"
            letterSpacing="-0.01em"
          >
            {labelText}
          </text>
        </g>
      )}
    </g>
  );
};
