import React, { useRef, useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { NodeCard } from './NodeCard';
import { GroupCard } from './GroupCard';
import { EdgeRenderer } from './EdgeRenderer';
import { Minimap } from './Minimap';
import { calculateBezierPath, getHandleCoordinates } from '../../utils/geometry';
import {
  MousePointer,
  Hand,
  Maximize2,
  Sparkles,
  Plus,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

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
    zoomIn,
    zoomOut,
    zoomToFit,
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
    setActiveTool,
    setNewNodeModalOpen,
    setActiveView,
    resetToTemplate,
  } = useGraphStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Marquee selection state
  const [isMarquee, setIsMarquee] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Track spacebar for panning
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

  // Safe active view filter configuration
  const currentView = (views && views.find((v) => v.id === activeViewId)) || (views && views[0]) || {
    id: 'view-all',
    name: 'Unified Graph',
    perspective: 'all',
    filterCategories: [],
    filterNodeTypes: [],
    filterRelationshipTypes: [],
  };

  // Filter nodes based on active view and search query
  const filteredNodes = Object.values(nodes || {}).filter((node) => {
    if (!node || node.graphId !== activeGraphId) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = node.name?.toLowerCase().includes(q);
      const matchesDesc = node.description?.toLowerCase().includes(q);
      const matchesType = node.type?.toLowerCase().includes(q);
      const matchesTag = node.tags?.some((t) => t.toLowerCase().includes(q));
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
  const filteredEdges = Object.values(edges || {}).filter((edge) => {
    if (!edge || edge.graphId !== activeGraphId) return false;
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
  const filteredGroups = Object.values(groups || {}).filter((g) => g && g.graphId === activeGraphId);

  // Native non-passive Wheel & Trackpad Pinch Gesture with focal point zooming
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentTransform = useGraphStore.getState().transform;

      if (e.ctrlKey || e.metaKey) {
        // High-precision pinch-to-zoom
        const zoomDelta = -e.deltaY * 0.01;
        const newZoom = Math.max(0.15, Math.min(3.0, currentTransform.zoom * (1 + zoomDelta)));
        const newX = mouseX - (mouseX - currentTransform.x) * (newZoom / currentTransform.zoom);
        const newY = mouseY - (mouseY - currentTransform.y) * (newZoom / currentTransform.zoom);
        setTransform({ x: newX, y: newY, zoom: newZoom });
      } else {
        // Standard wheel zooming
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        const newZoom = Math.max(0.15, Math.min(3.0, currentTransform.zoom * zoomFactor));
        const newX = mouseX - (mouseX - currentTransform.x) * (newZoom / currentTransform.zoom);
        const newY = mouseY - (mouseY - currentTransform.y) * (newZoom / currentTransform.zoom);
        setTransform({ x: newX, y: newY, zoom: newZoom });
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
  }, [setTransform]);

  // Canvas background mousedown for panning / marquee
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan or marquee if clicking directly on the canvas background
    const isDirectCanvasClick =
      e.target === containerRef.current ||
      (e.target as HTMLElement).classList.contains('canvas-viewport') ||
      (e.target as HTMLElement).classList.contains('canvas-grid-matrix') ||
      (e.target as HTMLElement).classList.contains('canvas-plane') ||
      (e.target as HTMLElement).classList.contains('canvas-nodes-layer') ||
      (e.target as HTMLElement).classList.contains('canvas-groups-layer') ||
      (e.target as HTMLElement).tagName === 'svg';

    if (!isDirectCanvasClick) return;

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
          const w = n.size?.width || 230;
          const h = n.size?.height || 96;
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
      setTimeout(() => {
        if (useGraphStore.getState().pendingConnection) {
          cancelPendingConnection();
        }
      }, 60);
    }
  };

  // Compute live pending connection line
  let pendingLinePath = '';
  if (pendingConnection && nodes[pendingConnection.sourceNodeId]) {
    const srcNode = nodes[pendingConnection.sourceNodeId];
    const srcW = srcNode.size?.width || 230;
    const srcH = srcNode.size?.height || 96;
    const srcSize = { width: srcW, height: srcH };
    const p1 = getHandleCoordinates(srcNode.position, srcSize, pendingConnection.sourceHandle);
    const p2 = { x: pendingConnection.currentX, y: pendingConnection.currentY };
    pendingLinePath = calculateBezierPath(p1, p2, pendingConnection.sourceHandle, 'left').path;
  }

  const isPerspectiveFiltered = currentView && currentView.perspective !== 'all';
  const allRelationshipTypes = { ...BUILTIN_RELATIONSHIP_TYPES, ...customRelationshipTypes };

  return (
    <div
      ref={containerRef}
      className={`canvas-viewport ${isPanning || isSpacePressed ? 'is-panning' : ''}`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => {
        if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-viewport')) {
          e.preventDefault();
          onCanvasContextMenu(e);
        }
      }}
    >
      {/* Precision Spatial Grid Matrix */}
      {isGridVisible && <div className="canvas-grid-matrix" />}

      {/* Infinite Transformed Coordinate Plane */}
      <div
        className="canvas-plane"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      >
        {/* Layer 1: Groups Layer */}
        <div className="canvas-groups-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} isSelected={selectedGroupIds.includes(group.id)} />
          ))}
        </div>

        {/* Layer 2: SVG Edges Layer */}
        <svg
          className="canvas-edges-layer"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <defs>
            {Object.values(allRelationshipTypes).map((rel) => (
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
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={rel.color || '#0f172a'} />
              </marker>
            ))}
            <marker
              id="marker-default"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0f172a" />
            </marker>
          </defs>

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

          {/* Active Live Dragging Connection Curve */}
          {pendingConnection && (
            <path
              d={pendingLinePath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth={2}
              strokeDasharray="4, 3"
              markerEnd="url(#marker-uses)"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(79, 70, 229, 0.3))' }}
            />
          )}
        </svg>

        {/* Layer 3: Nodes Layer (DOM elements with full direct interactivity!) */}
        <div className="canvas-nodes-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {filteredNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              customType={customNodeTypes[node.type]}
              isSelected={selectedNodeIds.includes(node.id)}
              onContextMenu={onNodeContextMenu}
            />
          ))}
        </div>

        {/* Layer 4: Marquee Selection Bounding Box */}
        {isMarquee && marqueeBox && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
              top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
              width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
              height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
              border: '1px solid #0f172a',
              backgroundColor: 'rgba(15, 23, 42, 0.05)',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 60,
            }}
          />
        )}
      </div>

      {/* Blueprint Spatial Empty State */}
      {filteredNodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '28px 32px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-dialog)',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px',
              maxWidth: '360px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {isPerspectiveFiltered ? `Perspective: ${currentView?.name}` : 'Spatial Architecture Canvas'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              {isPerspectiveFiltered
                ? 'No architectural nodes match this perspective filter.'
                : 'Represent and architect software systems by plotting nodes or deploying a starter template.'}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {isPerspectiveFiltered ? (
                <button
                  onClick={() => setActiveView('view-all')}
                  className="hupa-btn primary"
                >
                  <Layers size={13} /> Switch to Unified View
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setNewNodeModalOpen(true)}
                    className="hupa-btn primary"
                  >
                    <Plus size={13} /> Add First Node
                  </button>
                  <button
                    onClick={() => resetToTemplate('fullstack-web')}
                    className="hupa-btn"
                  >
                    Deploy Fullstack
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Contextual Tool Dock */}
      <div className="floating-dock">
        <button
          onClick={() => setActiveTool('select')}
          className={`hupa-btn ghost icon-only ${activeTool === 'select' ? 'primary' : ''}`}
          title="Select Tool (V)"
          style={{
            backgroundColor: activeTool === 'select' ? '#0f172a' : 'transparent',
            color: activeTool === 'select' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <MousePointer size={13} />
        </button>

        <button
          onClick={() => setActiveTool('pan')}
          className={`hupa-btn ghost icon-only ${activeTool === 'pan' ? 'primary' : ''}`}
          title="Pan Workspace (H or Space+Drag)"
          style={{
            backgroundColor: activeTool === 'pan' ? '#0f172a' : 'transparent',
            color: activeTool === 'pan' ? '#ffffff' : 'var(--text-secondary)',
          }}
        >
          <Hand size={13} />
        </button>

        <div className="dock-divider" />

        <button
          onClick={() => setNewNodeModalOpen(true)}
          className="hupa-btn ghost"
          title="Create Architectural Node (N)"
        >
          <Plus size={12} /> Node
        </button>

        <button
          onClick={onAutoLayout}
          className="hupa-btn ghost"
          title="Compute Hierarchical DAG Auto-Layout"
        >
          <Sparkles size={12} color="var(--accent-indigo)" /> Auto-Layout
        </button>

        <div className="dock-divider" />

        <button
          onClick={() => zoomOut()}
          className="hupa-btn ghost icon-only"
          title="Zoom Out"
        >
          <ZoomOut size={13} />
        </button>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '0 4px',
            color: 'var(--text-secondary)',
            userSelect: 'none',
          }}
        >
          {Math.round(transform.zoom * 100)}%
        </span>

        <button
          onClick={() => zoomIn()}
          className="hupa-btn ghost icon-only"
          title="Zoom In"
        >
          <ZoomIn size={13} />
        </button>

        <button
          onClick={() => zoomToFit()}
          className="hupa-btn ghost icon-only"
          title="Fit to Screen (F)"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Spatial Minimap */}
      <Minimap />
    </div>
  );
};
