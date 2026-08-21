import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { Activity, Layers, MousePointer } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    nodes,
    edges,
    activeGraphId,
    graphs,
    selectedNodeIds,
    selectedEdgeIds,
    activeViewId,
    views,
    transform,
  } = useGraphStore();

  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
  const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);
  const activeGraph = graphs[activeGraphId];
  const activeView = views.find((v) => v.id === activeViewId) || views[0];

  const selectionText =
    selectedNodeIds.length > 0
      ? `${selectedNodeIds.length} node${selectedNodeIds.length > 1 ? 's' : ''} selected`
      : selectedEdgeIds.length > 0
      ? `${selectedEdgeIds.length} edge${selectedEdgeIds.length > 1 ? 's' : ''} selected`
      : 'No selection';

  return (
    <footer className="statusbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={12} color="#10b981" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {activeGraph?.name || 'Root Graph'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MousePointer size={11} />
          <span>{selectionText}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <span>Graph: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{currentNodes.length}</strong> nodes,{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{currentEdges.length}</strong> edges
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={11} />
          <span>View: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{activeView?.name}</strong>
        </div>

        <div>
          <span>Zoom: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{Math.round(transform.zoom * 100)}%</strong>
        </div>
      </div>
    </footer>
  );
};
