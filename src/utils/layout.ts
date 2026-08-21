import type { UPGNode, UPGEdge, NodePosition } from '../types/graph';

export type LayoutAlgorithm = 'hierarchical' | 'tree-horizontal' | 'radial' | 'grid';

export function computeAutoLayout(
  nodes: UPGNode[],
  edges: UPGEdge[],
  algorithm: LayoutAlgorithm = 'hierarchical'
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  if (nodes.length === 0) return positions;

  const nodeIds = nodes.map((n) => n.id);

  // Build adjacency
  const inDegree: Record<string, number> = {};
  const outEdges: Record<string, string[]> = {};

  nodeIds.forEach((id) => {
    inDegree[id] = 0;
    outEdges[id] = [];
  });

  edges.forEach((e) => {
    if (inDegree[e.targetNodeId] !== undefined) {
      inDegree[e.targetNodeId]++;
    }
    if (outEdges[e.sourceNodeId]) {
      outEdges[e.sourceNodeId].push(e.targetNodeId);
    }
  });

  if (algorithm === 'grid') {
    const cols = Math.ceil(Math.sqrt(nodes.length * 1.5));
    const spacingX = 260;
    const spacingY = 160;
    const startX = 100;
    const startY = 100;

    nodes.forEach((n, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      positions[n.id] = {
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      };
    });
    return positions;
  }

  if (algorithm === 'radial') {
    // Find node with highest degree as center
    let centerId = nodeIds[0];
    let maxDeg = -1;
    nodeIds.forEach((id) => {
      const deg = (inDegree[id] || 0) + (outEdges[id]?.length || 0);
      if (deg > maxDeg) {
        maxDeg = deg;
        centerId = id;
      }
    });

    const centerX = 600;
    const centerY = 450;
    positions[centerId] = { x: centerX, y: centerY };

    const remaining = nodeIds.filter((id) => id !== centerId);
    const radiusStep = 320;
    const itemsPerRing = 8;

    remaining.forEach((id, idx) => {
      const ring = Math.floor(idx / itemsPerRing) + 1;
      const ringIdx = idx % itemsPerRing;
      const totalInRing = Math.min(itemsPerRing, remaining.length - (ring - 1) * itemsPerRing);
      const angle = (2 * Math.PI * ringIdx) / totalInRing;
      const r = ring * radiusStep;

      positions[id] = {
        x: Math.round(centerX + r * Math.cos(angle)),
        y: Math.round(centerY + r * Math.sin(angle)),
      };
    });
    return positions;
  }

  if (algorithm === 'tree-horizontal' || algorithm === 'hierarchical') {
    // Layered Topological Sorting
    const layers: string[][] = [];
    const visited = new Set<string>();

    // Layer 0: Roots with inDegree == 0
    let currentLayer = nodeIds.filter((id) => inDegree[id] === 0);
    if (currentLayer.length === 0) {
      currentLayer = [nodeIds[0]];
    }

    while (currentLayer.length > 0 && visited.size < nodeIds.length) {
      layers.push(currentLayer);
      currentLayer.forEach((id) => visited.add(id));

      const nextLayerSet = new Set<string>();
      currentLayer.forEach((id) => {
        (outEdges[id] || []).forEach((targetId) => {
          if (!visited.has(targetId)) {
            nextLayerSet.add(targetId);
          }
        });
      });

      // If no outgoing unvisited, add any unvisited node
      if (nextLayerSet.size === 0 && visited.size < nodeIds.length) {
        const remaining = nodeIds.find((id) => !visited.has(id));
        if (remaining) nextLayerSet.add(remaining);
      }

      currentLayer = Array.from(nextLayerSet);
    }

    const spacingX = 300;
    const spacingY = 160;
    const startX = 80;
    const startY = 100;

    if (algorithm === 'hierarchical') {
      // Horizontal flow: Layers along X, items along Y
      layers.forEach((layer, layerIdx) => {
        const layerHeight = layer.length * spacingY;
        const offsetY = Math.max(startY, 400 - layerHeight / 2);

        layer.forEach((id, itemIdx) => {
          positions[id] = {
            x: startX + layerIdx * spacingX,
            y: offsetY + itemIdx * spacingY,
          };
        });
      });
    } else {
      // Vertical tree flow: Layers along Y, items along X
      layers.forEach((layer, layerIdx) => {
        const layerWidth = layer.length * spacingX;
        const offsetX = Math.max(startX, 600 - layerWidth / 2);

        layer.forEach((id, itemIdx) => {
          positions[id] = {
            x: offsetX + itemIdx * spacingX,
            y: startY + layerIdx * spacingY,
          };
        });
      });
    }

    return positions;
  }

  return positions;
}
