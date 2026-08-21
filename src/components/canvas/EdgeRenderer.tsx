import React from 'react';
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
  const relDef = customType || BUILTIN_RELATIONSHIP_TYPES[edge.type] || BUILTIN_RELATIONSHIP_TYPES.custom;

  // Determine handles
  const sourceHandle: HandlePosition = (edge.sourceHandle as HandlePosition) || 'right';
  const targetHandle: HandlePosition = (edge.targetHandle as HandlePosition) || 'left';

  const p1 = getHandleCoordinates(sourceNode.position, sourceNode.size, sourceHandle);
  const p2 = getHandleCoordinates(targetNode.position, targetNode.size, targetHandle);

  const { path, midPoint } = calculateBezierPath(p1, p2, sourceHandle, targetHandle);

  const edgeColor = isSelected ? '#09090b' : edge.color || relDef.color || '#27272a';
  const strokeWidth = isSelected ? 2.5 : 1.75;
  const lineStyle = edge.lineStyle || relDef.lineStyle || 'solid';

  const getStrokeDasharray = () => {
    if (lineStyle === 'dashed') return '6, 4';
    if (lineStyle === 'dotted') return '2, 4';
    return undefined;
  };

  const isAnimated = edge.animated || relDef.animated;

  return (
    <g id={`edge-${edge.id}`} className="graph-edge-group">
      {/* Fat invisible path for easier hover/click hit testing */}
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

      {/* Selected halo glow */}
      {isSelected && (
        <path
          d={path}
          fill="none"
          stroke="#09090b"
          strokeWidth={6}
          strokeOpacity={0.2}
        />
      )}

      {/* Main visible path */}
      <path
        d={path}
        fill="none"
        stroke={edgeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeDasharray()}
        markerEnd={`url(#marker-${edge.type})`}
        style={{
          transition: 'stroke 0.15s ease, stroke-width 0.15s ease',
          animation: isAnimated ? 'dashFlow 1.2s linear infinite' : undefined,
        }}
      />

      {/* Interactive Midpoint Label Pill */}
      {edge.label && (
        <g
          transform={`translate(${midPoint.x}, ${midPoint.y})`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(edge.id, e.shiftKey || e.ctrlKey);
          }}
        >
          <rect
            x={-((edge.label.length * 6.2) / 2 + 8)}
            y={-10}
            width={edge.label.length * 6.2 + 16}
            height={20}
            rx={10}
            fill="#ffffff"
            stroke={isSelected ? '#09090b' : '#d4d4d8'}
            strokeWidth={isSelected ? 1.5 : 1}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))',
              transition: 'stroke 0.15s ease',
            }}
          />
          <text
            x={0}
            y={3.5}
            textAnchor="middle"
            fill={isSelected ? '#09090b' : '#3f3f46'}
            fontSize={10}
            fontWeight={500}
            fontFamily="var(--font-mono)"
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
};
