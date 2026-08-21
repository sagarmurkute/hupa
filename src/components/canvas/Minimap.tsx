import React, { useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';

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
    maxX = Math.max(maxX, n.position.x + n.size.width);
    maxY = Math.max(maxY, n.position.y + n.size.height);
  });

  const padding = 200;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const worldWidth = Math.max(100, maxX - minX);
  const worldHeight = Math.max(100, maxY - minY);

  const mapWidth = 180;
  const mapHeight = 120;

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
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '44px',
        right: '16px',
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 35,
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                border: '1px dashed #71717a',
                borderRadius: '3px',
              }}
            />
          );
        })}

        {/* Draw Nodes */}
        {currentNodes.map((n) => {
          const nx = (n.position.x - minX) * scale;
          const ny = (n.position.y - minY) * scale;
          const nw = Math.max(3, n.size.width * scale);
          const nh = Math.max(2, n.size.height * scale);
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
                backgroundColor: isSelected ? '#09090b' : '#71717a',
                borderRadius: '2px',
                opacity: isSelected ? 1 : 0.6,
              }}
            />
          );
        })}

        {/* Viewport Box */}
        <div
          style={{
            position: 'absolute',
            left: `${vpMapX}px`,
            top: `${vpMapY}px`,
            width: `${vpMapW}px`,
            height: `${vpMapH}px`,
            border: '1.5px solid #09090b',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
