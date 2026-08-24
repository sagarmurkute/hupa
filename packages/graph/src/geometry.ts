import type { NodePosition, NodeSize } from '@hupa/core';

export type HandlePosition = 'top' | 'right' | 'bottom' | 'left';

export interface Point {
  x: number;
  y: number;
}

export function getHandleCoordinates(
  pos: NodePosition,
  size: NodeSize,
  handle: HandlePosition = 'right'
): Point {
  switch (handle) {
    case 'top':
      return { x: pos.x + size.width / 2, y: pos.y };
    case 'right':
      return { x: pos.x + size.width, y: pos.y + size.height / 2 };
    case 'bottom':
      return { x: pos.x + size.width / 2, y: pos.y + size.height };
    case 'left':
      return { x: pos.x, y: pos.y + size.height / 2 };
  }
}

export function getAutoHandles(
  sourcePos: NodePosition,
  sourceSize: NodeSize,
  targetPos: NodePosition,
  targetSize: NodeSize
): { sourceHandle: HandlePosition; targetHandle: HandlePosition } {
  const sourceCenter = {
    x: sourcePos.x + sourceSize.width / 2,
    y: sourcePos.y + sourceSize.height / 2,
  };
  const targetCenter = {
    x: targetPos.x + targetSize.width / 2,
    y: targetPos.y + targetSize.height / 2,
  };

  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      sourceHandle: dx > 0 ? 'right' : 'left',
      targetHandle: dx > 0 ? 'left' : 'right',
    };
  } else {
    return {
      sourceHandle: dy > 0 ? 'bottom' : 'top',
      targetHandle: dy > 0 ? 'top' : 'bottom',
    };
  }
}

export function calculateBezierPath(
  p1: Point,
  p2: Point,
  sourceHandle: HandlePosition = 'right',
  targetHandle: HandlePosition = 'left'
): { path: string; midPoint: Point } {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const curvature = Math.max(30, Math.min(120, Math.max(dx, dy) * 0.5));

  let cp1 = { x: p1.x, y: p1.y };
  let cp2 = { x: p2.x, y: p2.y };

  if (sourceHandle === 'right') cp1.x += curvature;
  else if (sourceHandle === 'left') cp1.x -= curvature;
  else if (sourceHandle === 'bottom') cp1.y += curvature;
  else if (sourceHandle === 'top') cp1.y -= curvature;

  if (targetHandle === 'left') cp2.x -= curvature;
  else if (targetHandle === 'right') cp2.x += curvature;
  else if (targetHandle === 'top') cp2.y -= curvature;
  else if (targetHandle === 'bottom') cp2.y += curvature;

  const path = `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;

  // Approximate midpoint on bezier curve
  const t = 0.5;
  const midX = (1 - t) ** 3 * p1.x + 3 * (1 - t) ** 2 * t * cp1.x + 3 * (1 - t) * t ** 2 * cp2.x + t ** 3 * p2.x;
  const midY = (1 - t) ** 3 * p1.y + 3 * (1 - t) ** 2 * t * cp1.y + 3 * (1 - t) * t ** 2 * cp2.y + t ** 3 * p2.y;

  return { path, midPoint: { x: midX, y: midY } };
}

export function snapToGrid(val: number, gridSize = 20): number {
  return Math.round(val / gridSize) * gridSize;
}
