import React, { useRef } from 'react';
import { useGraphStore } from '@hupa/state';

export const Minimap: React.FC = () => {
  const {
    nodes,
    groups,
    activeGraphId,
    transform,
    setTransform,
    selectedNodeIds,
  } = useGraphStore();

  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
  const currentGroups = Object.values(groups).filter((g) => g.graphId === activeGraphId);

  const containerRef = useRef<HTMLDivElement>(null);

  if (currentNodes.length === 0) return null;

  // Calculate world bounds
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  currentNodes.forEach((n) => {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + (n.size?.width || 240));
    maxY = Math.max(maxY, n.position.y + (n.size?.height || 76));
  });

  const padding = 160;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const worldWidth = Math.max(100, maxX - minX);
  const worldHeight = Math.max(100, maxY - minY);

  const mapWidth = 160;
  const mapHeight = 100;

  const scaleX = mapWidth / worldWidth;
  const scaleY = mapHeight / worldHeight;
  const scale = Math.min(scaleX, scaleY);

  // Viewport bounds in world coordinates
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  const vpWorldX = -transform.x / transform.zoom;
  const vpWorldY = -transform.y / transform.zoom;
  const vpWorldW = viewportW / transform.zoom;
  const vpWorldH = viewportH / transform.zoom;

  // Viewport rect on minimap
  const vpMapX = (vpWorldX - minX) * scale;
  const vpMapY = (vpWorldY - minY) * scale;
  const vpMapW = vpWorldW * scale;
  const vpMapH = vpWorldH * scale;

  const handleMinimapClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = minX + clickX / scale;
    const targetWorldY = minY + clickY / scale;

    setTransform({
      x: viewportW / 2 - targetWorldX * transform.zoom,
      y: viewportH / 2 - targetWorldY * transform.zoom,
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleMinimapClick}
      style={{
        position: 'absolute',
        bottom: '18px',
        right: '18px',
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 25,
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-drawer)',
      }}
      title="Minimap (Click to pan)"
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'var(--surface-subtle)' }}>
        {/* Draw Groups */}
        {currentGroups.map((g) => {
          const gx = (g.position.x - minX) * scale;
          const gy = (g.position.y - minY) * scale;
          const gw = g.size.width * scale;
          const gh = g.size.height * scale;
          return (
            <div
              key={g.id}
              style={{
                position: 'absolute',
                left: `${gx}px`,
                top: `${gy}px`,
                width: `${gw}px`,
                height: `${gh}px`,
                backgroundColor: 'rgba(15, 23, 42, 0.04)',
                border: '1px dashed #94a3b8',
                borderRadius: '3px',
              }}
            />
          );
        })}

        {/* Draw Nodes */}
        {currentNodes.map((n) => {
          const nx = (n.position.x - minX) * scale;
          const ny = (n.position.y - minY) * scale;
          const nw = Math.max(4, (n.size?.width || 240) * scale);
          const nh = Math.max(3, (n.size?.height || 76) * scale);
          const isSelected = selectedNodeIds.includes(n.id);

          return (
            <div
              key={n.id}
              style={{
                position: 'absolute',
                left: `${nx}px`,
                top: `${ny}px`,
                width: `${nw}px`,
                height: `${nh}px`,
                backgroundColor: isSelected ? '#0f172a' : '#64748b',
                borderRadius: '2px',
              }}
            />
          );
        })}

        {/* Viewport Bounds Rectangle */}
        <div
          style={{
            position: 'absolute',
            left: `${Math.max(0, vpMapX)}px`,
            top: `${Math.max(0, vpMapY)}px`,
            width: `${Math.min(mapWidth, vpMapW)}px`,
            height: `${Math.min(mapHeight, vpMapH)}px`,
            border: '1.5px solid #0f172a',
            backgroundColor: 'rgba(15, 23, 42, 0.08)',
            pointerEvents: 'none',
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  );
};
