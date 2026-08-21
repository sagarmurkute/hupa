import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { NodeCard } from './NodeCard';
import { GroupCard } from './GroupCard';
import { EdgeRenderer } from './EdgeRenderer';
import { Minimap } from './Minimap';
import { CanvasControls } from './CanvasControls';
import { calculateBezierPath } from '../../utils/geometry';
import { Plus, Layers } from 'lucide-react';

interface GraphCanvasProps {
  onNodeContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onEdgeContextMenu: (e: React.MouseEvent, edgeId: string) => void;
  onCanvasContextMenu: (e: React.MouseEvent) => void;
  onAutoLayout: () => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  onNodeContextMenu,
  onEdgeContextMenu,
  onCanvasContextMenu,
  onAutoLayout,
}) => {
  const {
    nodes,
    edges,
    groups,
    activeGraphId,
    activeViewId,
    views,
    searchQuery,
    transform,
    setTransform,
    selectedNodeIds,
    selectedEdgeIds,
    selectedGroupIds,
    selectEdge,
    clearSelection,
    isGridVisible,
    pendingConnection,
    updatePendingConnection,
    cancelPendingConnection,
    customNodeTypes,
    customRelationshipTypes,
    activeTool,
    setNewNodeModalOpen,
    setActiveView,
  } = useGraphStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Marquee selection state
  const [isMarquee, setIsMarquee] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Track spacebar key for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Active view filter configuration
  const currentView = views.find((v) => v.id === activeViewId) || views[0];

  // Filter nodes based on active view and search query
  const filteredNodes = Object.values(nodes).filter((node) => {
    if (node.graphId !== activeGraphId) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = node.name.toLowerCase().includes(q);
      const matchesDesc = node.description.toLowerCase().includes(q);
      const matchesType = node.type.toLowerCase().includes(q);
      const matchesTag = node.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesName && !matchesDesc && !matchesType && !matchesTag) {
        return false;
      }
    }

    // View perspective filter
    if (currentView && currentView.perspective !== 'all') {
      const typeDef = BUILTIN_NODE_TYPES[node.type] || customNodeTypes[node.type];
      if (currentView.filterCategories && currentView.filterCategories.length > 0) {
        if (!typeDef || !currentView.filterCategories.includes(typeDef.category)) {
          return false;
        }
      }
      if (currentView.filterNodeTypes && currentView.filterNodeTypes.length > 0) {
        if (!currentView.filterNodeTypes.includes(node.type)) {
          return false;
        }
      }
    }

    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

  // Filter edges
  const filteredEdges = Object.values(edges).filter((edge) => {
    if (edge.graphId !== activeGraphId) return false;
    // Both endpoints must be visible
    if (!filteredNodeIds.has(edge.sourceNodeId) || !filteredNodeIds.has(edge.targetNodeId)) {
      return false;
    }

    if (currentView && currentView.perspective !== 'all') {
      if (currentView.filterRelationshipTypes && currentView.filterRelationshipTypes.length > 0) {
        if (!currentView.filterRelationshipTypes.includes(edge.type)) {
          return false;
        }
      }
    }

    return true;
  });

  // Filter groups
  const filteredGroups = Object.values(groups).filter((g) => g.graphId === activeGraphId);

  // Mouse wheel zoom with focal point
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.max(0.15, Math.min(3.0, transform.zoom * zoomFactor));

      const newX = mouseX - (mouseX - transform.x) * (newZoom / transform.zoom);
      const newY = mouseY - (mouseY - transform.y) * (newZoom / transform.zoom);

      setTransform({ x: newX, y: newY, zoom: newZoom });
    },
    [transform, setTransform]
  );

  // Canvas background mousedown for panning / marquee
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (isSpacePressed || activeTool === 'pan'))) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    } else if (e.button === 0) {
      if (e.shiftKey || activeTool === 'marquee') {
        setIsMarquee(true);
        const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const canvasX = (e.clientX - rect.left - transform.x) / transform.zoom;
        const canvasY = (e.clientY - rect.top - transform.y) / transform.zoom;
        setMarqueeBox({
          startX: canvasX,
          startY: canvasY,
          currentX: canvasX,
          currentY: canvasY,
        });
      } else {
        clearSelection();
        setIsPanning(true);
        setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setTransform({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (isMarquee && marqueeBox && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - transform.x) / transform.zoom;
      const canvasY = (e.clientY - rect.top - transform.y) / transform.zoom;
      setMarqueeBox({ ...marqueeBox, currentX: canvasX, currentY: canvasY });
    } else if (pendingConnection && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - transform.x) / transform.zoom;
      const canvasY = (e.clientY - rect.top - transform.y) / transform.zoom;
      updatePendingConnection(canvasX, canvasY);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (isMarquee && marqueeBox) {
      const minX = Math.min(marqueeBox.startX, marqueeBox.currentX);
      const maxX = Math.max(marqueeBox.startX, marqueeBox.currentX);
      const minY = Math.min(marqueeBox.startY, marqueeBox.currentY);
      const maxY = Math.max(marqueeBox.startY, marqueeBox.currentY);

      const enclosedNodeIds = filteredNodes
        .filter((n) => {
          const w = n.size?.width || 210;
          const h = n.size?.height || 110;
          const nCenterX = n.position.x + w / 2;
          const nCenterY = n.position.y + h / 2;
          return nCenterX >= minX && nCenterX <= maxX && nCenterY >= minY && nCenterY <= maxY;
        })
        .map((n) => n.id);

      useGraphStore.setState({ selectedNodeIds: enclosedNodeIds });
      setIsMarquee(false);
      setMarqueeBox(null);
    }
    if (pendingConnection) {
      cancelPendingConnection();
    }
  };

  // Keyboard shortcut listener on canvas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedNodeIds, selectedEdgeIds, deleteNode, deleteEdge } = useGraphStore.getState();
        selectedNodeIds.forEach((id) => deleteNode(id));
        selectedEdgeIds.forEach((id) => deleteEdge(id));
      } else if (e.key === 'f' || e.key === 'F') {
        useGraphStore.getState().zoomToFit();
      } else if (e.key === 'g' || e.key === 'G') {
        useGraphStore.getState().toggleGrid();
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        useGraphStore.getState().setShortcutsModalOpen(true);
      } else if (e.key === 'Escape') {
        useGraphStore.getState().clearSelection();
        useGraphStore.getState().cancelPendingConnection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live pending connection line
  let pendingLinePath = '';
  if (pendingConnection && nodes[pendingConnection.sourceNodeId]) {
    const srcNode = nodes[pendingConnection.sourceNodeId];
    const srcW = srcNode.size?.width || 210;
    const srcH = srcNode.size?.height || 110;
    const p1 = {
      x:
        pendingConnection.sourceHandle === 'right'
          ? srcNode.position.x + srcW
          : pendingConnection.sourceHandle === 'left'
          ? srcNode.position.x
          : srcNode.position.x + srcW / 2,
      y:
        pendingConnection.sourceHandle === 'bottom'
          ? srcNode.position.y + srcH
          : pendingConnection.sourceHandle === 'top'
          ? srcNode.position.y
          : srcNode.position.y + srcH / 2,
    };
    const p2 = { x: pendingConnection.currentX, y: pendingConnection.currentY };
    pendingLinePath = calculateBezierPath(p1, p2, pendingConnection.sourceHandle, 'left').path;
  }

  return (
    <div
      ref={containerRef}
      className={`canvas-wrapper ${isGridVisible ? 'canvas-grid-dots' : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => {
        if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
          e.preventDefault();
          onCanvasContextMenu(e);
        }
      }}
      style={{
        cursor: isPanning || isSpacePressed ? 'grabbing' : pendingConnection ? 'crosshair' : 'default',
      }}
    >
      {/* Transformed Graph Container */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        {/* SVG Layer for Edges and Markers */}
        <svg
          style={{
            position: 'absolute',
            width: '100000px',
            height: '100000px',
            left: '-50000px',
            top: '-50000px',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <defs>
            {Object.values(BUILTIN_RELATIONSHIP_TYPES).map((rel) => (
              <marker
                key={rel.type}
                id={`marker-${rel.type}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#09090b" />
              </marker>
            ))}
          </defs>

          <g transform="translate(50000, 50000)" style={{ pointerEvents: 'auto' }}>
            {/* Render Groups */}
            {filteredGroups.map((group) => (
              <foreignObject
                key={group.id}
                x={group.position.x}
                y={group.position.y}
                width={group.size.width}
                height={group.size.height}
                style={{ overflow: 'visible' }}
              >
                <GroupCard
                  group={group}
                  isSelected={selectedGroupIds.includes(group.id)}
                />
              </foreignObject>
            ))}

            {/* Render Edges */}
            {filteredEdges.map((edge) => {
              const src = nodes[edge.sourceNodeId];
              const tgt = nodes[edge.targetNodeId];
              if (!src || !tgt) return null;
              return (
                <EdgeRenderer
                  key={edge.id}
                  edge={edge}
                  sourceNode={src}
                  targetNode={tgt}
                  customType={customRelationshipTypes[edge.type]}
                  isSelected={selectedEdgeIds.includes(edge.id)}
                  onSelect={selectEdge}
                  onContextMenu={onEdgeContextMenu}
                />
              );
            })}

            {/* Live Pending Connection Path */}
            {pendingConnection && (
              <path
                d={pendingLinePath}
                fill="none"
                stroke="#09090b"
                strokeWidth={2}
                strokeDasharray="6, 4"
                style={{ animation: 'dashFlow 0.8s linear infinite' }}
              />
            )}

            {/* Render Nodes */}
            {filteredNodes.map((node) => (
              <foreignObject
                key={node.id}
                x={node.position.x}
                y={node.position.y}
                width={node.size?.width || 210}
                height={node.size?.height || 110}
                style={{ overflow: 'visible' }}
              >
                <NodeCard
                  node={node}
                  customType={customNodeTypes[node.type]}
                  isSelected={selectedNodeIds.includes(node.id)}
                  onContextMenu={onNodeContextMenu}
                />
              </foreignObject>
            ))}
          </g>
        </svg>

        {/* Marquee Selection Rectangle */}
        {isMarquee && marqueeBox && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
              top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
              width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
              height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
              border: '1.5px solid #09090b',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 50,
            }}
          />
        )}
      </div>

      {/* Empty State Overlay when 0 nodes match current graph or view filter */}
      {filteredNodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            color: 'var(--text-muted)',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '24px 32px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '360px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentView.perspective !== 'all'
                ? `No nodes in "${currentView.name}"`
                : 'Empty Graph Canvas'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {currentView.perspective !== 'all'
                ? 'The active view perspective filtered out all nodes. Switch to Unified Graph or add relevant components.'
                : 'Start designing your architecture by adding a node or applying a starter layout.'}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {currentView.perspective !== 'all' ? (
                <button
                  onClick={() => setActiveView('view-all')}
                  className="btn btn-primary"
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                >
                  <Layers size={13} /> Switch to Unified View
                </button>
              ) : (
                <button
                  onClick={() => setNewNodeModalOpen(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                >
                  <Plus size={13} /> Add First Node
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Canvas Controls */}
      <CanvasControls onAutoLayout={onAutoLayout} />

      {/* Minimap */}
      <Minimap />
    </div>
  );
};
